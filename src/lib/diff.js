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
      diffParts: [],
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

  const originalSegments = [];
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

/**
 * Computes word-level diff segments between original text and rewritten text.
 * Backwards-compatible helper for automated backend tests and external tools.
 *
 * @param {string} originalText
 * @param {string} rewrittenText
 * @returns {Array<{ value: string, added: boolean, removed: boolean, type: string }>}
 */
export function computeWordDiff(originalText = '', rewrittenText = '') {
  if (typeof originalText !== 'string') originalText = '';
  if (typeof rewrittenText !== 'string') rewrittenText = '';

  const changes = diffWords(originalText, rewrittenText);

  return changes.map(part => {
    let type = 'unchanged';
    if (part.added) type = 'added';
    else if (part.removed) type = 'removed';

    return {
      value: part.value,
      added: Boolean(part.added),
      removed: Boolean(part.removed),
      type
    };
  });
}
