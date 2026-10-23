# VibeShift AI — Shared Full-Stack API Contract

This document defines the unified interface contract between the React frontend (developed by Agrim), the Node.js/Express backend (implemented by Shreya & Dilbahar), and integration testing (coordinated by Anshika).

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check and safe LLM configuration status | None |
| `POST` | `/api/rewrite` | Transform a text draft into exactly 3 stylistic rewrites + communication insights | None (browser calls server) |

---

## 2. Health Check Endpoint

### `GET /api/health`

#### Success Response (`HTTP 200 OK`)
```json
{
  "status": "ok",
  "configured": true,
  "model": "gemini-2.5-flash"
}
```

*Security guarantee: The API key and secrets are NEVER returned.*

---

## 3. Rewrite Endpoint

### `POST /api/rewrite`

#### Request Body Schema
The backend accepts both backend-native and frontend-form payloads transparently:

```json
{
  "message": "The original rough draft (or field name 'text')",
  "tone": "Professional",
  "customTone": "",
  "audience": "Executive / C-Level",
  "channel": "Chat / Direct Message",
  "preset": "Executive C-Level",
  "length": "Shorter",
  "targetWords": 35,
  "language": "English"
}
```

#### Field Specifications & Compatibility Aliases

| Field | Primary / Alias | Constraints | Default |
| :--- | :--- | :--- | :--- |
| **Draft** | `text` or `message` | 1 to 2,000 words; non-empty. | *Required* |
| **Tone** | `tone` | `Professional`, `Friendly`, `Diplomatic`, `Generic`, `Custom` | `Professional` |
| **Custom Tone**| `customTone` | 1-300 characters when `tone === 'Custom'` | `""` |
| **Audience** | `audience` | `Manager`, `Professor`, `Teacher`, `Friend`, `Executive/C-Level` (`Executive / C-Level`), `Legal/Compliance` (`Legal / Compliance`) | `Manager` |
| **Channel** | `channel` | `Email`, `Chat` (`Chat / Direct Message`), `Announcement`, `Feedback` | `Email` |
| **Preset** | `preset` | `executive` (`Executive C-Level`), `supportive` (`Supportive Peer`), `legal` (`Legal / Compliance`), `genz` (`Gen-Z Hype`), or `null` | `null` |
| **Length** | `length` | `shorter` (`Shorter`), `same` (`Same`), `longer` (`Longer`) | `same` |
| **Word Limit** | `targetWordLimit` or `targetWords` | Integer 1 to 2,000 | None |
| **Language** | `language` | `English`, `Hindi`, `Hinglish`, `Spanish`, `French`, `German`, `Arabic`, `Japanese` | `English` |

---

## 4. Response Schemas

### Success Response (`HTTP 200 OK`)

Returns exactly three validated versions and communication perception insights:

```json
{
  "status": "success",
  "versions": [
    {
      "id": "v1",
      "label": "Version 1 — Recommended",
      "text": "Production deployment is rescheduled for Monday to address an authentication blocker.",
      "whatChanged": "Condensed into a single outcome-focused line emphasizing decision and blocker.",
      "styleDescription": "Clear, outcome-focused, and tailored for Executive / C-Level",
      "tone": "Professional",
      "audience": "Executive/C-Level"
    },
    {
      "id": "v2",
      "label": "Version 2 — More Diplomatic",
      "text": "Please be advised that the production deployment has been moved to Monday to resolve an authentication issue.",
      "whatChanged": "Structured with formal, professional corporate phrasing.",
      "styleDescription": "Softer phrasing emphasizing collaborative commitment",
      "tone": "Diplomatic",
      "audience": "Executive/C-Level"
    },
    {
      "id": "v3",
      "label": "Version 3 — More Concise",
      "text": "Auth issue identified during pre-release. Deploy deferred to Monday for resolution.",
      "whatChanged": "Crisp executive bullet style with zero filler.",
      "styleDescription": "Crisp executive bullet style with zero filler",
      "tone": "Professional",
      "audience": "Executive/C-Level"
    }
  ],
  "insights": {
    "toneShift": "Draft → Professional",
    "clarity": "The request is explicit with an exact completion timeline.",
    "directness": "High executive directness with crisp focus",
    "audienceFit": "Calibrated register and vocabulary specifically for Executive / C-Level.",
    "keyChanges": [
      "Condensed into a single outcome-focused line emphasizing decision and blocker.",
      "Structured with formal, professional corporate phrasing.",
      "Crisp executive bullet style with zero filler."
    ],
    "howItMightComeAcross": "The revised message sounds professional and respectful, while still communicating the urgency clearly.",
    "meaningCheck": {
      "preservedFacts": [
        "Core intent and message preserved",
        "Specific dates, figures, and deadlines retained",
        "Explicit commitments and conditions kept intact"
      ],
      "possibleOmissions": [],
      "unsupportedAdditions": [],
      "uncertainChanges": []
    }
  }
}
```

### Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Draft text cannot be empty or whitespace only.",
    "details": [
      { "field": "text", "message": "Draft text cannot be empty or whitespace only." }
    ]
  },
  "message": "Draft text cannot be empty or whitespace only."
}
```

---

## 5. Client Integration & Metric Formula

- **`src/lib/api.js`**: Frontend API client with fallback and health verification.
- **`src/lib/diff.js`**: Word-level diff (`calculateDiff` and `computeWordDiff`).
- **`src/lib/metrics.js`**: `calculateMetrics` and `computeChangeMetrics`:

$$\text{changePercent} = 100 \times \frac{\text{addedWordCount} + \text{deletedWordCount}}{\max(\text{originalWordCount}, 1)}$$
