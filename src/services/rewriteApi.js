/**
 * Client-side API service for PERSONASHIFT AI.
 * Used by Agrim's React frontend to interact with the Express backend.
 */

const API_BASE_URL = (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL)
  || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  || '';

/**
 * Checks server and AI configuration health.
 * @returns {Promise<{ status: string, configured: boolean, model?: string }>}
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Submits a text draft for tone and persona transformation.
 *
 * @param {Object} params
 * @param {string} params.text - The original draft (required, <= 2000 words)
 * @param {string} [params.tone='Professional'] - Selected tone
 * @param {string} [params.customTone=''] - Custom style instruction (when tone === 'Custom')
 * @param {string} [params.audience='Manager'] - Target audience
 * @param {string} [params.channel='Email'] - Communication channel
 * @param {string|null} [params.preset=null] - Preset vibe (executive, supportive, legal, genz)
 * @param {string} [params.length='same'] - Length preference (shorter, same, longer)
 * @param {number} [params.targetWordLimit] - Optional word count target
 * @param {string} [params.language='English'] - Output language
 * @returns {Promise<{ versions: Array<{ label: string, text: string, whatChanged: string }> }>}
 */
export async function requestRewrite(params) {
  const payload = {
    text: params.text,
    tone: params.tone || 'Professional',
    customTone: params.customTone || '',
    audience: params.audience || 'Manager',
    channel: params.channel || 'Email',
    preset: params.preset || null,
    length: params.length || 'same',
    language: params.language || 'English'
  };

  if (typeof params.targetWordLimit === 'number' && params.targetWordLimit > 0) {
    payload.targetWordLimit = params.targetWordLimit;
  }

  const response = await fetch(`${API_BASE_URL}/api/rewrite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorObj = data?.error;
    const message = errorObj?.message || `Request failed with HTTP ${response.status}`;
    const err = new Error(message);
    err.code = errorObj?.code || 'API_ERROR';
    err.status = response.status;
    err.details = errorObj?.details;
    throw err;
  }

  return data;
}
