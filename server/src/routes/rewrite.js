import { Router } from 'express';
import { rewriteRequestSchema } from '../lib/schema.js';
import { executeRewrite } from '../lib/llm.js';

const router = Router();

router.post('/rewrite', async (req, res) => {
  const startTime = Date.now();

  // 1. Validate request body with Zod
  const validationResult = rewriteRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    // Primary human-readable message from the first validation issue
    const primaryMessage = errorDetails[0]?.message || 'Please enter a valid message and check your settings.';

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: primaryMessage,
        details: errorDetails
      },
      message: primaryMessage
    });
  }

  const validatedData = validationResult.data;

  try {
    // 2. Call the rewrite execution orchestrator
    const result = await executeRewrite(validatedData, {
      allowMockFallback: false
    });

    const elapsed = Date.now() - startTime;
    // Log metadata without leaking draft content
    console.log(`[API /rewrite] 200 OK (${elapsed}ms) - Tone: ${validatedData.tone}, Preset: ${validatedData.preset || 'none'}, Audience: ${validatedData.audience}`);

    return res.status(200).json(result);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /rewrite] Failed (${elapsed}ms): [${err.code || 'UNKNOWN'}] ${err.message}`);

    const status = err.status || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'An unexpected error occurred while processing the rewrite request.';

    return res.status(status).json({
      error: {
        code,
        message
      },
      message
    });
  }
});

export default router;
