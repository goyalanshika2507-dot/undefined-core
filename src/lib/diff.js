import { diffWords } from 'diff';

/**
 * Counts words in a string accurately, handling extra whitespace.
 * @param {string} text 
 * @returns {number}
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Counts characters in a string (including or excluding whitespace).
 * @param {string} text 
 * @returns {number}
 */
export function countCharacters(text) {
  return text ? text.length : 0;
}

/**
 * Calculates word-level differences between original and rewritten text.
 * Returns added words, removed words, renderable segments, change percentage, and word difference.
 * 
 * @param {string} original 
 * @param {string} rewritten 
 * @returns {object}
 */
export function calculateDiff(original = '', rewritten = '') {
  const orig = original || '';
  const rew = rewritten || '';

  const originalWordCount = countWords(orig);
  const rewrittenWordCount = countWords(rew);
  const wordDifference = rewrittenWordCount - originalWordCount;

  if (!orig && !rew) {
    return {
      originalSegments: [],
      rewrittenSegments: [],
      addedWords: 0,
      removedWords: 0,
      unchangedWords: 0,
      originalWordCount: 0,
      rewrittenWordCount: 0,
      wordDifference: 0,
      changePercentage: 0,
    };
  }

  // Use diff npm package to get word-level diff parts
  const diffParts = diffWords(orig, rew);

  let addedWords = 0;
  let removedWords = 0;
  let unchangedWords = 0;

  // Segments for Original Draft:
  // Shows unchanged text + removed text (which was removed in the rewrite)
  const originalSegments = [];

  // Segments for Rewritten Version:
  // Shows unchanged text + added text (which was added in the rewrite)
  const rewrittenSegments = [];

  diffParts.forEach((part, index) => {
    const partWordCount = countWords(part.value);

    if (part.added) {
      addedWords += partWordCount;
      rewrittenSegments.push({
        id: `rew-${index}`,
        text: part.value,
        type: 'added',
      });
    } else if (part.removed) {
      removedWords += partWordCount;
      originalSegments.push({
        id: `orig-${index}`,
        text: part.value,
        type: 'removed',
      });
    } else {
      unchangedWords += partWordCount;
      originalSegments.push({
        id: `orig-${index}`,
        text: part.value,
        type: 'unchanged',
      });
      rewrittenSegments.push({
        id: `rew-${index}`,
        text: part.value,
        type: 'unchanged',
      });
    }
  });

  // Calculate change percentage per formula:
  // (added words + removed words) / max(original word count, 1) * 100
  const maxOriginal = Math.max(originalWordCount, 1);
  const rawChangePercentage = ((addedWords + removedWords) / maxOriginal) * 100;
  const changePercentage = Math.min(100, Math.round(rawChangePercentage));

  return {
    diffParts,
    originalSegments,
    rewrittenSegments,
    addedWords,
    removedWords,
    unchangedWords,
    originalWordCount,
    rewrittenWordCount,
    wordDifference,
    changePercentage,
  };
}
