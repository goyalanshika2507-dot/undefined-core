# VIBESHIFT AI (PERSONASHIFT AI)

**VibeShift** is a real-time AI-powered communication transformation platform that refashions rough message drafts into three tailored, persona-aligned rewrites for any audience, tone, channel, length, and language—while strictly preserving meaning, commitments, dates, and factual integrity.

---

## 1. Project Overview & Features

- **Strict Meaning Preservation**: Enforces 11 core factual rules to prevent hallucination, altered deadlines, invented commitments, or lost uncertainties.
- **Three Distinct Rewrite Options**: Every generation delivers exactly three differentiated variations (e.g. Recommended / Balanced, More Diplomatic, Crisp / Concise).
- **Communication Insights & Meaning Review**: AI-driven evaluation of tone shift, clarity, directness, audience fit, key changes, and a factual preservation checklist.
- **Comprehensive Persona Controls**:
  - **Tones**: `Professional`, `Friendly`, `Diplomatic`, `Generic`, `Custom` (with up to 300-char style prompt).
  - **Audiences**: `Manager`, `Professor`, `Teacher`, `Friend`, `Executive / C-Level`, `Legal / Compliance`.
  - **Channels**: `Email`, `Chat / Direct Message`, `Announcement`, `Feedback`.
  - **Presets**: `Executive C-Level` (crisp, outcome-first, max 3 lines), `Supportive Peer` (constructive warmth without sugarcoating), `Legal / Compliance` (formal risk-conscious phrasing without giving legal advice), `Gen-Z Hype` (casual, authentic energy).
  - **Lengths**: `Shorter`, `Same`, `Longer`, with optional `targetWords` (1–2,000 words).
  - **Languages**: `English`, `Hindi`, `Hinglish` (Latin code-switching), `Spanish`, `French`, `German`, `Arabic`, `Japanese`.
- **Client-Side Word-Level Diff & Metrics**: Deterministic jsdiff word comparison calculating added/removed words, length delta, change percentage, and lexical similarity without trusting synthetic scores.
- **Robust Security & Validation**: Zod-based server validation, 100KB body limit, 2,000-word draft limit, rate limiting, and defensive JSON parsing that strips markdown fences.

---

## 2. Technology Stack & Architecture

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React icons.
- **Backend**: Node.js (v20+ / v24), Express 4 (ES Modules).
- **AI Provider**: Google Gemini via official `@google/genai` SDK (`gemini-2.5-flash` default).
- **Validation**: Zod 3.
- **Diff & Comparison**: `diff` (jsdiff).
- **Testing**: Built-in `node:test` runner (33 automated unit and integration tests).

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
│   │   ├── index.js             # Express app setup, rate limiting, error handling (Port 5000)
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
│       ├── integration_frontend.test.js # Full-stack frontend contract tests
│       ├── llm.test.js          # JSON parsing and error handling tests
│       ├── prompt.test.js       # Prompt builder tests
│       └── schema.test.js       # Zod schema validation tests
└── src/
    ├── components/              # React UI components (VersionCard, OutputPanel, etc.)
    ├── pages/                   # Application pages (WritePage, HistoryPage, AboutPage)
    ├── lib/
    │   ├── api.js               # Frontend API client
    │   ├── diff.js              # Word-level diff comparison
    │   └── metrics.js           # Change percent and lexical similarity
    └── services/
        └── rewriteApi.js        # Alternative client fetch wrapper
```

---

## 3. Prerequisites

- **Node.js**: `v20.0.0` or higher (tested on Node v24.20.0).
- **npm**: `v10.0.0` or higher.
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/).

---

## 4. Installation & Environment Setup

1. **Clone the repository and switch to the working branch:**
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
   PORT=5000
   # LLM_MODEL=gemini-2.5-flash
   ```
   *Note: Never commit your `.env` file or API keys to Git.*

---

## 5. Running the Application

### Start the Backend Server (Port 5000)
```bash
npm run server
```
For auto-reload during development:
```bash
npm run server:dev
```
- Health check: `http://localhost:5000/api/health`
- Rewrite endpoint: `http://localhost:5000/api/rewrite`

### Start Frontend (Vite on Port 5173)
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. All `/api` requests are automatically proxied to the Express backend.

---

## 6. Running Automated Tests

Run the full automated test suite (33 tests across schema, prompt, parser, diff, api, and frontend integration):
```bash
npm test
```

To run tests in mock mode without consuming Gemini API quota:
```bash
MOCK_LLM=true npm test
```

---

## 7. Building for Production

```bash
npm run build
```
Generates production assets in `dist/`.

---

## 8. Handoff & Team Workflow

- **Shared Working Branch**: `feat/backend-api`
- **Initial Backend**: Shreya
- **Backend Continuation & Integration**: Dilbahar
- **Frontend**: Agrim (independently implemented and merged from `frontend` branch)
- **Integration Coordination & QA**: Anshika
