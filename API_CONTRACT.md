# PERSONASHIFT AI — Shared API Contract

This document defines the interface contract between the React frontend (owned by Agrim), the Node.js/Express backend (implemented by Shreya, continued by Dilbahar), and integration testing (coordinated by Anshika).

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check and safe LLM configuration status | None |
| `POST` | `/api/rewrite` | Transform a text draft into exactly 3 stylistic rewrites | None (browser calls server) |

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

*Note: The API key is never exposed in the response.*

---

## 3. Rewrite Endpoint

### `POST /api/rewrite`

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body Schema
```json
{
  "text": "The original rough draft (required, 1-2000 words)",
  "tone": "Professional",
  "customTone": "",
  "audience": "Manager",
  "channel": "Email",
  "preset": "executive",
  "length": "shorter",
  "targetWordLimit": 40,
  "language": "English"
}
```

#### Field Specifications

| Field | Type | Required | Allowed Values / Constraints | Default |
| :--- | :--- | :--- | :--- | :--- |
| `text` | string | **Yes** | 1 to 2,000 words; cannot be empty or whitespace only. | None |
| `tone` | string | No | `Professional`, `Friendly`, `Diplomatic`, `Generic`, `Custom` | `Professional` |
| `customTone` | string | Conditional | Required when `tone === 'Custom'` (1-300 characters). Ignored otherwise. | `""` |
| `audience` | string | No | `Manager`, `Professor`, `Teacher`, `Friend`, `Executive/C-Level`, `Legal/Compliance` | `Manager` |
| `channel` | string | No | `Email`, `Chat`, `Announcement`, `Feedback` | `Email` |
| `preset` | string \| null | No | `executive`, `supportive`, `legal`, `genz`, or `null` | `null` |
| `length` | string | No | `shorter`, `same`, `longer` | `same` |
| `targetWordLimit`| integer | No | Positive integer between 1 and 2,000 | None |
| `language` | string | No | `English`, `Hindi`, `Hinglish`, `Spanish`, `French`, `German`, `Arabic`, `Japanese` | `English` |

*Notes:*
- Presets take precedence over conflicting general tone/audience choices, but length and language remain strictly enforced.
- When `targetWordLimit` is supplied, it serves as a soft target: essential facts, commitments, and dates are never dropped merely to satisfy word count.

---

## 4. Response Schemas

### Success Response (`HTTP 200 OK`)

Returns exactly three distinct rewrite variations.

```json
{
  "versions": [
    {
      "label": "Version 1",
      "text": "We need to reschedule the quarterly roadmap sync to Friday due to unresolved blocker #102.",
      "whatChanged": "Replaced informal expressions with direct, outcome-focused phrasing and made the blocker actionable."
    },
    {
      "label": "Version 2",
      "text": "Please be advised that the quarterly roadmap review has been deferred to Friday to address open issue #102.",
      "whatChanged": "Structured with formal, professional corporate phrasing suitable for executive visibility."
    },
    {
      "label": "Version 3",
      "text": "Quick update on the roadmap review: we're shifting our sync to Friday so we can knock out issue #102 first.",
      "whatChanged": "Adopted an approachable, conversational cadence while preserving all dates and issue references."
    }
  ]
}
```

### Error Responses

All error responses share a standard JSON structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Draft text cannot be empty or whitespace only.",
    "details": [
      {
        "field": "text",
        "message": "Draft text cannot be empty or whitespace only."
      }
    ]
  }
}
```

#### HTTP Status Codes & Error Codes

| Status | Code | Trigger |
| :--- | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Empty draft, >2000 words, unsupported enum value, invalid customTone. |
| `400` | `INVALID_JSON` | Malformed JSON in request body. |
| `401` | `AUTH_ERROR` | Provided LLM API key was rejected by provider. |
| `413` | `PAYLOAD_TOO_LARGE` | Request body exceeds 100KB limit. |
| `429` | `RATE_LIMIT_EXCEEDED` | Client exceeded local Express rate limits. |
| `429` | `PROVIDER_RATE_LIMIT`| Gemini quota exhausted or upstream rate-limited. |
| `502` | `PROVIDER_ERROR` | Upstream AI service network error or failure. |
| `502` | `MODEL_OUTPUT_INVALID`| Model failed to return valid JSON matching the 3-version schema after retry. |
| `503` | `CONFIG_MISSING` | `LLM_API_KEY` is not configured on the server. |
| `504` | `PROVIDER_TIMEOUT` | AI provider did not respond within timeout (30 seconds). |

---

## 5. Client Integration Utilities

Pre-built client utilities are available for the frontend:
- **`src/services/rewriteApi.js`**: `checkHealth()`, `requestRewrite(params)`
- **`src/lib/diff.js`**: `computeWordDiff(originalText, rewrittenText)`
- **`src/lib/metrics.js`**: `computeChangeMetrics(originalText, rewrittenText)`

### Metric Calculation Formula
```javascript
changePercent = 100 * (addedWordCount + removedWordCount) / Math.max(originalWordCount, 1)
lexicalSimilarity = Math.max(0, Math.min(100, Math.round(100 - changePercent)))
```
*Note: Lexical similarity reflects surface word-overlap and MUST NOT be conflated with semantic or factual equivalence.*
