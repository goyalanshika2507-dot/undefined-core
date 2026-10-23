import { GoogleGenAI } from '@google/genai';
import { modelOutputSchema } from './schema.js';

/**
 * Extracts and parses JSON from raw LLM output, defensively stripping code fences.
 */
export function extractAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from model.');
  }

  let cleaned = rawText.trim();

  // Remove markdown code fences if present (e.g. ```json ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Find outermost JSON object if there is leading/trailing prose
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse model response as JSON: ${err.message}`);
  }

  return parsed;
}

/**
 * Validates parsed object against the required 3-version schema.
 */
export function validateModelOutput(parsedData) {
  const result = modelOutputSchema.safeParse(parsedData);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Model response schema validation failed: ${errorMsg}`);
  }
  return result.data;
}

/**
 * Generates mocked response for automated tests or when MOCK_LLM=true.
 */
export function generateMockRewrite({ text, tone, preset, audience, length, language }) {
  const cleanSnippet = (text || '').trim().slice(0, 60);
  return {
    versions: [
      {
        label: 'Version 1',
        text: `[Balanced & Direct] ${cleanSnippet}... Tailored for ${audience} with a ${tone} tone.`,
        whatChanged: `Streamlined phrasing for ${audience}, eliminated redundant expressions, and reinforced direct clarity.`
      },
      {
        label: 'Version 2',
        text: `[Polished & Professional] Regarding: ${cleanSnippet}... Structured clearly for ${audience}.`,
        whatChanged: `Elevated vocabulary and formal structure to match ${preset || tone} standards while preserving commitments.`
      },
      {
        label: 'Version 3',
        text: `[Approachable & Clear] Quick update for ${audience}: ${cleanSnippet}...`,
        whatChanged: `Adopted an engaging, concise cadence suited for immediate comprehension while keeping all facts intact.`
      }
    ]
  };
}

/**
 * Calls Gemini using the official @google/genai SDK.
 */
export async function callGemini({
  systemInstructions,
  userMessage,
  apiKey = process.env.LLM_API_KEY,
  model = process.env.LLM_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  timeoutMs = 30000,
  clientOverride = null
}) {
  if (!apiKey) {
    const err = new Error('LLM_API_KEY is not configured on the server.');
    err.code = 'CONFIG_MISSING';
    err.status = 503;
    throw err;
  }

  const ai = clientOverride || new GoogleGenAI({ apiKey });

  // Create an abort controller for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: 'application/json',
        temperature: 0.7,
        abortSignal: controller.signal
      }
    });

    clearTimeout(timeoutId);

    const rawText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!rawText) {
      const err = new Error('AI provider returned an empty response body.');
      err.code = 'EMPTY_PROVIDER_RESPONSE';
      err.status = 502;
      throw err;
    }

    return rawText;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError' || controller.signal.aborted) {
      const timeoutErr = new Error('AI provider request timed out. Please retry.');
      timeoutErr.code = 'PROVIDER_TIMEOUT';
      timeoutErr.status = 504;
      throw timeoutErr;
    }

    // Preserve status if already categorized
    if (err.status && err.code) {
      throw err;
    }

    const message = err.message || '';

    // Handle common Gemini API errors gracefully without exposing secrets
    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
      const keyErr = new Error('Invalid LLM_API_KEY provided. Please check server configuration.');
      keyErr.code = 'AUTH_ERROR';
      keyErr.status = 401;
      throw keyErr;
    }

    if (message.includes('RESOURCE_EXHAUSTED') || message.includes('quota') || message.includes('429')) {
      const quotaErr = new Error('Gemini API quota exceeded or rate limit reached. Please wait and retry.');
      quotaErr.code = 'PROVIDER_RATE_LIMIT';
      quotaErr.status = 429;
      throw quotaErr;
    }

    if (message.includes('NOT_FOUND') || message.includes('model not found')) {
      const modelErr = new Error(`Configured model '${model}' was not found. Please verify LLM_MODEL.`);
      modelErr.code = 'MODEL_NOT_FOUND';
      modelErr.status = 502;
      throw modelErr;
    }

    const genericErr = new Error('An error occurred while communicating with the AI service.');
    genericErr.code = 'PROVIDER_ERROR';
    genericErr.status = 502;
    throw genericErr;
  }
}

/**
 * High-level rewrite execution orchestrator with parsing and single controlled retry.
 */
export async function executeRewrite(params, options = {}) {
  // If mock mode is explicitly requested or in test mode without an API key
  if (process.env.MOCK_LLM === 'true' || (!process.env.LLM_API_KEY && options.allowMockFallback)) {
    return generateMockRewrite(params);
  }

  const { buildPrompt } = await import('./prompt.js');
  const { systemInstructions, userMessage } = buildPrompt(params);

  let rawOutput;
  let parsed;

  try {
    rawOutput = await callGemini({
      systemInstructions,
      userMessage,
      apiKey: options.apiKey || process.env.LLM_API_KEY,
      model: options.model,
      clientOverride: options.clientOverride
    });
    parsed = extractAndParseJSON(rawOutput);
    return validateModelOutput(parsed);
  } catch (firstErr) {
    // If it's a configuration, auth, timeout, or rate-limit error, do not retry parsing
    if (['CONFIG_MISSING', 'AUTH_ERROR', 'PROVIDER_RATE_LIMIT', 'PROVIDER_TIMEOUT'].includes(firstErr.code)) {
      throw firstErr;
    }

    // Single controlled retry with an explicit JSON reminder
    try {
      const reminderUserMessage = `${userMessage}\n\nCRITICAL REMINDER: You must output ONLY a valid JSON object matching the schema with exactly three versions. Do not output markdown code fences or explanatory text.`;
      rawOutput = await callGemini({
        systemInstructions,
        userMessage: reminderUserMessage,
        apiKey: options.apiKey || process.env.LLM_API_KEY,
        model: options.model,
        clientOverride: options.clientOverride
      });
      parsed = extractAndParseJSON(rawOutput);
      return validateModelOutput(parsed);
    } catch (secondErr) {
      // If validation or parsing still fails, return a recoverable error
      const recoverableErr = new Error('Failed to generate valid rewrite versions from AI model. Please try again.');
      recoverableErr.code = 'MODEL_OUTPUT_INVALID';
      recoverableErr.status = 502;
      throw recoverableErr;
    }
  }
}
