import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  const isConfigured = Boolean(process.env.LLM_API_KEY && process.env.LLM_API_KEY.trim().length > 0);
  res.status(200).json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.LLM_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  });
});

export default router;
