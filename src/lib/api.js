/**
 * VibeShift API Client
 * 
 * Interacts with the VibeShift Express backend service.
 */

// Default endpoint target: uses relative '/api' so Vite proxy routes seamlessly in dev,
// or falls back to VITE_API_URL when explicitly configured.
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_CONFIG = {
  baseUrl: localStorage.getItem('vibeshift_api_url') || DEFAULT_API_BASE_URL,
  endpoints: {
    rewrite: '/rewrite',
    regenerateVersion: '/rewrite/version',
    health: '/health',
  },
  timeoutMs: 30000,
};

/**
 * Updates the API base URL in runtime.
 * @param {string} url 
 */
export function setApiBaseUrl(url) {
  API_CONFIG.baseUrl = url.trim();
  localStorage.setItem('vibeshift_api_url', API_CONFIG.baseUrl);
}

/**
 * Resets the API base URL to default.
 */
export function resetApiBaseUrl() {
  API_CONFIG.baseUrl = DEFAULT_API_BASE_URL;
  localStorage.removeItem('vibeshift_api_url');
}

/**
 * Checks if the backend service is reachable.
 * @returns {Promise<{ isConnected: boolean, message: string, data?: object }>}
 */
export async function checkBackendHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { isConnected: true, message: 'Backend connected', data };
    }
    return { isConnected: false, message: `Backend responded with HTTP ${response.status}` };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      isConnected: false,
      message: 'Backend not running or unreachable at ' + API_CONFIG.baseUrl,
    };
  }
}

/**
 * Sends a message rewrite request to the backend.
 * 
 * @param {object} payload
 * @param {string} payload.message - The raw draft text
 * @param {string} [payload.text] - Alternative draft field
 * @param {string} payload.tone - Selected tone
 * @param {string} payload.audience - Selected audience
 * @param {string} payload.channel - Channel
 * @param {string} payload.length - Length preset
 * @param {number|null} payload.targetWords - Optional target word count
 * @param {string} payload.language - Output language
 * @param {string|null} payload.preset - Optional active vibe preset name
 * 
 * @returns {Promise<object>} Returns structured AI response containing versions and insights
 */
export async function generateRewrites(payload) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.rewrite}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = (typeof errorData?.error === 'string' ? errorData.error : errorData?.error?.message)
        || errorData?.message
        || `Backend returned error HTTP ${response.status}: ${response.statusText}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = errorData;
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // If fetch failed due to network error / connection refused:
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. The backend took too long to respond.');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.code === 'ECONNREFUSED') {
      const backendError = new Error('Frontend is ready. Connect the backend to generate AI rewrites.');
      backendError.code = 'BACKEND_NOT_CONNECTED';
      backendError.details = {
        attemptedUrl: url,
        assignedTo: 'Anshika (Integration), Dilbahar & Shreya (Backend)',
        instructions: 'Start the backend server on port 5000: `npm run server`',
      };
      throw backendError;
    }

    throw error;
  }
}

/**
 * SAMPLE CONTRACT DATA SPECIFICATION
 * 
 * Provided to preview the frontend UI components during offline development.
 */
export const SAMPLE_CONTRACT_PREVIEW = {
  status: 'success',
  versions: [
    {
      id: 'v1',
      label: 'Version 1 — Recommended',
      styleDescription: 'Clear, outcome-focused, and professional',
      whatChanged: 'Replaced accusatory phrasing with a polite, outcome-focused update.',
      text: 'Hi Mr. Smith,\n\nThe project update is delayed. It will be ready by the end of the day tomorrow.\n\nThank you for your patience and understanding.\n\nBest regards,\n[Your Name]',
      tone: 'Professional',
      audience: 'Manager',
    },
    {
      id: 'v2',
      label: 'Version 2 — More Diplomatic',
      styleDescription: 'Softer phrasing emphasizing collaborative commitment',
      whatChanged: 'Added diplomatic framing and acknowledgment of support.',
      text: 'Hi Mr. Smith,\n\nI wanted to keep you informed that the project update will be completed and submitted by the end of the day tomorrow. I appreciate your patience and support with this deliverable.\n\nBest regards,\n[Your Name]',
      tone: 'Diplomatic',
      audience: 'Manager',
    },
    {
      id: 'v3',
      label: 'Version 3 — More Concise',
      styleDescription: 'Crisp executive bullet style with zero filler',
      whatChanged: 'Condensed to a single status line with a clear deadline.',
      text: 'Hi Mr. Smith,\n\nUpdate status: The deliverable will be finalized and sent by 5:00 PM tomorrow. Thanks for your patience.\n\nBest,\n[Your Name]',
      tone: 'Professional',
      audience: 'Executive / C-Level',
    },
  ],
  insights: {
    toneShift: 'Draft → Professional',
    clarity: 'The request is explicit with an exact completion timeline.',
    directness: 'Moderate and diplomatic',
    audienceFit: 'Suitable for a professional message to a manager.',
    keyChanges: [
      'Replaced direct accusatory phrasing with a polite, constructive tone.',
      'Added a definitive timeline (end of day tomorrow).',
      'Included a professional closing and gesture of appreciation.',
    ],
    howItMightComeAcross: 'The revised message sounds professional and respectful, while still communicating the urgency clearly. It demonstrates responsibility and builds trust with the recipient.',
    meaningCheck: {
      preservedFacts: [
        'Report is delayed',
        'Submission scheduled by tomorrow end-of-day',
        'Client meeting requirement respected',
      ],
      possibleOmissions: [
        'Exact reason for the delay is not detailed in the brief note.',
      ],
      unsupportedAdditions: [],
      uncertainChanges: [],
    },
  },
};
