import { countWords } from './diff';

export const MAX_WORD_LIMIT = 2000;

/**
 * Validates the draft message.
 * 
 * @param {string} text 
 * @returns {{ isValid: boolean, error: string | null, wordCount: number }}
 */
export function validateMessage(text) {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a message to transform.',
      wordCount: 0,
    };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Your message cannot be empty. Type a draft or select a sample above.',
      wordCount: 0,
    };
  }

  const wordCount = countWords(trimmed);
  if (wordCount > MAX_WORD_LIMIT) {
    return {
      isValid: false,
      error: `Message exceeds the ${MAX_WORD_LIMIT} word limit (currently ${wordCount.toLocaleString()} words). Please shorten your draft.`,
      wordCount,
    };
  }

  return {
    isValid: true,
    error: null,
    wordCount,
  };
}
