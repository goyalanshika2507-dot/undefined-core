/**
 * VibeShift API Client
 * 
 * FRONTEND-ONLY IMPLEMENTATION (Member 1: Agrim)
 * 
 * CONTRACT SPECIFICATION FOR BACKEND INTEGRATION:
 * Dilbahar (Member 2) & Shreya (Member 3): Implement the backend endpoints matching this schema.
 * Anshika (Member 4): Connect this frontend client to the running backend service.
 */

// Default endpoint target. Configurable via environment variable or localStorage.
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_CONFIG = {
  baseUrl: localStorage.getItem('vibeshift_api_url') || DEFAULT_API_BASE_URL,
  endpoints: {
    rewrite: '/rewrite',
    regenerateVersion: '/rewrite/version',
    health: '/health',
  },
  timeoutMs: 15000,
};

/**
 * Updates the API base URL in runtime (useful for Anshika to point to live backend or ngrok).
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
 * @returns {Promise<{ isConnected: boolean, message: string }>}
 */
export async function checkBackendHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

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
 * @param {string} payload.tone - Selected tone (Professional, Friendly, Diplomatic, Generic)
 * @param {string} payload.audience - Selected audience (Manager, Professor, Teacher, Friend, Executive / C-Level, Legal / Compliance)
 * @param {string} payload.channel - Channel (Email, Chat / Direct Message, Announcement, Feedback)
 * @param {string} payload.length - Length preset (Shorter, Same, Longer)
 * @param {number|null} payload.targetWords - Optional target word count
 * @param {string} payload.language - Output language (English, Hindi, Hinglish, etc.)
 * @param {string|null} payload.preset - Optional active vibe preset name
 * 
 * @returns {Promise<object>} Returns structured AI response containing exactly 4 versions and insights
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
      const errorMessage = errorData?.error || `Backend returned error HTTP ${response.status}: ${response.statusText}`;
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
        instructions: 'Start the backend server on the configured port and implement POST /api/rewrite.',
      };
      throw backendError;
    }

    throw error;
  }
}

/**
 * SAMPLE CONTRACT DATA SPECIFICATION
 * 
 * Strictly provided to visualize and test the frontend UI components during
 * development and hackathon evaluation when the backend is not yet started.
 * Not presented as live AI output.
 */
export const SAMPLE_CONTRACT_PREVIEW = {
  status: 'success',
  versions: [
    {
      id: 'v1',
      label: 'Version 1 — Recommended',
      styleDescription: 'Clear, outcome-focused, and professional',
      text: 'Hi Mr. Smith,\n\nThe project update is delayed. It will be ready by the end of the day tomorrow.\n\nThank you for your patience and understanding.\n\nBest regards,\n[Your Name]',
      tone: 'Professional',
      audience: 'Manager',
    },
    {
      id: 'v2',
      label: 'Version 2 — More Diplomatic',
      styleDescription: 'Softer phrasing emphasizing collaborative commitment',
      text: 'Hi Mr. Smith,\n\nI wanted to keep you informed that the project update will be completed and submitted by the end of the day tomorrow. I appreciate your patience and support with this deliverable.\n\nBest regards,\n[Your Name]',
      tone: 'Diplomatic',
      audience: 'Manager',
    },
    {
      id: 'v3',
      label: 'Version 3 — More Concise',
      styleDescription: 'Crisp executive bullet style with zero filler',
      text: 'Hi Mr. Smith,\n\nUpdate status: The deliverable will be finalized and sent by 5:00 PM tomorrow. Thanks for your patience.\n\nBest,\n[Your Name]',
      tone: 'Professional',
      audience: 'Executive / C-Level',
    },
    {
      id: 'v4',
      label: 'Version 4 — Supportive / Peer',
      styleDescription: 'Warm, transparent, and approachable',
      text: 'Hi Mr. Smith,\n\nJust a quick heads-up — the project is taking slightly longer than expected, but everything is on track to be ready by tomorrow evening. Thanks so much for your understanding!\n\nBest regards,\n[Your Name]',
      tone: 'Supportive',
      audience: 'Manager',
    },
  ],
  insights: {
    toneShift: 'Blunt → Professional',
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
