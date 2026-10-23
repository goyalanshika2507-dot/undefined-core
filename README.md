# PERSONASHIFT AI

**PERSONASHIFT AI** is a real-time AI-powered communication transformation tool that refashions rough message drafts into three tailored, persona-aligned rewrites for any audience, tone, channel, length, and language—while strictly preserving meaning, commitments, dates, and factual integrity.

---

## 1. Project Overview & Features

- **Strict Meaning Preservation**: Enforces 11 core factual rules to prevent hallucination, altered deadlines, invented commitments, or lost uncertainties.
- **Three Distinct Rewrite Options**: Every generation delivers exactly three differentiated variations (e.g. Balanced & Direct, Polished & Formal, Approachable & Crisp).
- **Comprehensive Persona Controls**:
  - **Tones**: `Professional`, `Friendly`, `Diplomatic`, `Generic`, `Custom` (with up to 300-char style prompt).
  - **Audiences**: `Manager`, `Professor`, `Teacher`, `Friend`, `Executive/C-Level`, `Legal/Compliance`.
  - **Channels**: `Email`, `Chat`, `Announcement`, `Feedback`.
  - **Presets**: `executive` (crisp, outcome-first, max 3 lines), `supportive` (constructive warmth without sugarcoating), `legal` (formal risk-conscious phrasing without giving legal advice), `genz` (casual, authentic energy).
  - **Lengths**: `shorter`, `same`, `longer`, with optional `targetWordLimit` (1–2,000 words).
  - **Languages**: `English`, `Hindi`, `Hinglish` (Latin code-switching), `Spanish`, `French`, `German`, `Arabic`, `Japanese`.
- **Client-Side Word-Level Diff & Metrics**: Deterministic jsdiff word comparison calculating added/removed words, length delta, change percentage, and lexical similarity without trusting synthetic scores.
- **Robust Security & Validation**: Zod-based server validation, 100KB body limit, 2,000-word draft limit, rate limiting, and defensive JSON parsing that strips markdown fences.

---

## 2. Technology Stack & Architecture

- **Backend**: Node.js (v20+ / v24), Express 4 (ES Modules).
- **AI Provider**: Google Gemini via the official `@google/genai` SDK (`gemini-2.5-flash` default).
- **Validation**: Zod 3.
- **Diff & Comparison**: `diff` (jsdiff).
- **Frontend Bridge**: Client API service (`src/services/rewriteApi.js`) and diff utilities (`src/lib/diff.js`, `src/lib/metrics.js`) designed for Vite + React.
- **Testing**: Built-in `node:test` runner (30 automated unit and integration tests).

```
undefined-core/
├── API_CONTRACT.md              # Shared contract between frontend and backend
├── HANDOFF.md                   # Developer handoff log
├── README.md                    # Project documentation
├── package.json                 # Project configuration and dependencies
├── vite.config.js               # Vite configuration with /api proxy to Express
├── .env.example                 # Environment variable template
├── server/
│   ├── src/
│   │   ├── index.js             # Express app setup, rate limiting, error handling
│   │   ├── routes/
│   │   │   ├── health.js        # GET /api/health
│   │   │   └── rewrite.js       # POST /api/rewrite
│   │   └── lib/
│   │       ├── llm.js           # Google GenAI client, error mapping, fallback
│   │       ├── prompt.js        # Prompt engineering & meaning-preservation rules
│   │       └── schema.js        # Zod validation schemas
│   └── test/
│       ├── api.test.js          # HTTP integration tests
│       ├── diff_metrics.test.js # Word diff and change metrics tests
│       ├── llm.test.js          # JSON parsing and error handling tests
│       ├── prompt.test.js       # Prompt builder tests
│       └── schema.test.js       # Zod schema validation tests
└── src/
    ├── lib/
    │   ├── diff.js              # Word-level comparison utility
    │   └── metrics.js           # Change percent and lexical similarity
    └── services/
        └── rewriteApi.js        # Client fetch wrapper for frontend
```

---

## 3. Prerequisites

- **Node.js**: `v20.0.0` or higher (tested on Node v24.20.0).
- **npm**: `v10.0.0` or higher.
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/).

---

## 4. Installation & Environment Setup

1. **Clone the repository and switch to the backend branch:**
   ```bash
   git clone https://github.com/goyalanshika2507-dot/undefined-core.git
   cd undefined-core
   git checkout feat/backend-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your Google Gemini API key:
   ```env
   LLM_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   # LLM_MODEL=gemini-2.5-flash
   ```
   *Note: Never commit your `.env` file or API keys to Git.*

---

## 5. Running the Application

### Start the Backend Server
```bash
npm run server
```
For auto-reload during development:
```bash
npm run server:dev
```
The server will start on `http://localhost:3001`.
- Health check: `http://localhost:3001/api/health`
- Rewrite endpoint: `http://localhost:3001/api/rewrite`

### Start Frontend (Vite)
When running the frontend dev server on port 5173, `vite.config.js` automatically proxies `/api` requests to `http://localhost:3001`.

---

## 6. Running Automated Tests

Run the full automated test suite (30 tests across schema, prompt, parser, diff, and API):
```bash
npm test
```

To run tests in mock mode without consuming Gemini API quota:
```bash
MOCK_LLM=true npm test
```

---

## 7. API Request & Response Contract

See [API_CONTRACT.md](file:///C:/Users/shreya/.gemini/antigravity/scratch/undefined-core/API_CONTRACT.md) for the complete specification.

### Example Request
```bash
curl -X POST http://localhost:3001/api/rewrite \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hey team, just letting you know that the prod release might slip to Monday because we found a bug in auth.",
    "tone": "Professional",
    "audience": "Executive/C-Level",
    "preset": "executive",
    "length": "shorter",
    "language": "English"
  }'
```

### Example Response
```json
{
  "versions": [
    {
      "label": "Version 1",
      "text": "Production deployment is rescheduled for Monday to address an authentication defect.",
      "whatChanged": "Condensed into a single outcome-focused line emphasizing the decision and blocker."
    },
    {
      "label": "Version 2",
      "text": "Update: Auth issue identified during pre-release. Deploy deferred to Monday for resolution.",
      "whatChanged": "Adopted crisp executive bullet structure highlighting impact and next steps."
    },
    {
      "label": "Version 3",
      "text": "Targeting Monday for production release following remediation of an auth blocker.",
      "whatChanged": "Direct status statement maintaining all dates, facts, and scope boundaries."
    }
  ]
}
```

---

## 8. Handoff & Team Workflow

- **Backend Branch**: `feat/backend-api`
- **Initial Implementation**: Shreya (API setup, validation, prompt engineering, Gemini SDK, client bridge utilities, test suite).
- **Continuation**: Dilbahar (continues on the same branch from [HANDOFF.md](file:///C:/Users/shreya/.gemini/antigravity/scratch/undefined-core/HANDOFF.md)).
- **Frontend**: Agrim (independently owns React components, UI, Tailwind styling).
- **Coordination**: Anshika (coordinates integration, contract verification, and demo testing).
