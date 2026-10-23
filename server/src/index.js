import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import healthRouter from './routes/health.js';
import rewriteRouter from './routes/rewrite.js';

const app = express();
// Default to port 5000 matching frontend DEFAULT_API_BASE_URL (http://localhost:5000/api)
const PORT = process.env.PORT || 5000;

// Trust reverse proxy headers if behind one
app.set('trust proxy', 1);

// Standard CORS configuration
app.use(cors({
  origin: true, // Allow frontend dev server and same-origin requests
  credentials: true
}));

// Request body limit (100kb is plenty for 2,000 words while preventing payload abuse)
app.use(express.json({ limit: '100kb' }));

// Basic rate limiter to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please try again after a few minutes.'
    },
    message: 'Too many requests from this IP. Please try again after a few minutes.'
  }
});

// Apply rate limiter to rewrite endpoints
app.use('/api/rewrite', apiLimiter);
app.use('/rewrite', apiLimiter);

// Register API routes under both /api and root (for serverless environments)
app.use('/api', healthRouter);
app.use('/api', rewriteRouter);
app.use(healthRouter);
app.use(rewriteRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`
    },
    message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Handle payload too large error from express.json
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body exceeds the maximum permitted limit of 100KB.'
      },
      message: 'Request body exceeds the maximum permitted limit of 100KB.'
    });
  }

  // Handle malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload provided in request body.'
      },
      message: 'Malformed JSON payload provided in request body.'
    });
  }

  console.error('[UNHANDLED_ERROR]', err.message);

  return res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred.'
    },
    message: 'An unexpected server error occurred.'
  });
});

// Start listener only if run directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`[VibeShift AI] Server running on http://localhost:${PORT}`);
    console.log(`[VibeShift AI] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[VibeShift AI] LLM status: ${process.env.LLM_API_KEY ? 'Configured' : 'Missing LLM_API_KEY'}`);
  });
}

export default app;
