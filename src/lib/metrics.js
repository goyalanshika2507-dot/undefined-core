import { calculateDiff, countWords, countCharacters } from './diff';

/**
 * Calculates complete change metrics between original and rewritten text.
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
