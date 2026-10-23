import { computeWordDiff } from './diff.js';

/**
 * Counts whitespace-delimited words in a string.
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates deterministic lexical change metrics from actual text comparison.
 *
 * Formula:
 * changePercent = 100 * (addedWordCount + removedWordCount) / Math.max(originalWordCount, 1)
 *
 * Note: Lexical similarity reflects surface word-overlap and MUST NOT be conflated
 * with semantic or factual equivalence.
 *
 * @param {string} originalText
 * @param {string} rewrittenText
 * @returns {{
 *   originalWordCount: number,
 *   rewrittenWordCount: number,
 *   wordCountDelta: number,
 *   addedWordCount: number,
 *   removedWordCount: number,
 *   changePercent: number,
 *   lexicalSimilarity: number
 * }}
 */
export function computeChangeMetrics(originalText = '', rewrittenText = '') {
  const originalWordCount = countWords(originalText);
  const rewrittenWordCount = countWords(rewrittenText);
  const wordCountDelta = rewrittenWordCount - originalWordCount;

  const diffParts = computeWordDiff(originalText, rewrittenText);

  let addedWordCount = 0;
  let removedWordCount = 0;

  for (const part of diffParts) {
    if (part.added) {
      addedWordCount += countWords(part.value);
    } else if (part.removed) {
      removedWordCount += countWords(part.value);
    }
  }

  const denominator = Math.max(originalWordCount, 1);
  const rawChangePercent = (100 * (addedWordCount + removedWordCount)) / denominator;
  const changePercent = Math.min(100, Math.round(rawChangePercent * 10) / 10);

  // Surface lexical similarity (0-100%)
  const lexicalSimilarity = Math.max(0, Math.min(100, Math.round((100 - changePercent) * 10) / 10));

  return {
    originalWordCount,
    rewrittenWordCount,
    wordCountDelta,
    addedWordCount,
    removedWordCount,
    changePercent,
    lexicalSimilarity
  };
}
