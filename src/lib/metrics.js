import { calculateDiff, countWords, countCharacters, computeWordDiff } from './diff.js';

export { countWords, countCharacters };

/**
 * Calculates complete change metrics between original and rewritten text.
 * Used directly by frontend components (ChangeMetrics, VersionCard, ComparisonPanel).
 * 
 * @param {string} original 
 * @param {string} rewritten 
 * @returns {object}
 */
export function calculateMetrics(original = '', rewritten = '') {
  const diffResult = calculateDiff(original, rewritten);
  const origWords = diffResult.originalWordCount;
  const rewWords = diffResult.rewrittenWordCount;
  const wordDiff = diffResult.wordDifference;
  const addedWords = diffResult.addedWords;
  const removedWords = diffResult.removedWords;

  // Format length difference label: e.g. "+14 words", "-8 words", "0 words"
  let lengthDiffLabel = '0 words';
  if (wordDiff > 0) {
    lengthDiffLabel = `+${wordDiff} words`;
  } else if (wordDiff < 0) {
    lengthDiffLabel = `${wordDiff} words`;
  }

  // Reading time estimate (average 200 words per minute)
  const readingTimeSec = Math.max(1, Math.round((rewWords / 200) * 60));

  return {
    originalWordCount: origWords,
    rewrittenWordCount: rewWords,
    originalCharCount: countCharacters(original),
    rewrittenCharCount: countCharacters(rewritten),
    lengthDifference: wordDiff,
    lengthDiffLabel,
    addedWords,
    removedWords,
    changePercentage: diffResult.changePercentage,
    readingTimeSeconds: readingTimeSec,
  };
}

/**
 * Validates whether change percentage is within typical modification bounds.
 * @param {number} percentage 
 * @returns {string} description
 */
export function getChangeIntensity(percentage) {
  if (percentage <= 15) return 'Minimal Polish';
  if (percentage <= 35) return 'Moderate Restructure';
  if (percentage <= 65) return 'Substantial Shift';
  return 'Complete Rewrite';
}

/**
 * Calculates deterministic lexical change metrics from actual text comparison.
 * Formula:
 * changePercent = 100 * (addedWordCount + removedWordCount) / Math.max(originalWordCount, 1)
 *
 * Backwards-compatible helper for automated backend tests.
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
