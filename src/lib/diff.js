import { diffWords } from 'diff';

/**
 * Computes word-level diff segments between original text and rewritten text.
 * Each segment has:
 * - value: string content
 * - added: boolean (true if inserted in rewritten text)
 * - removed: boolean (true if deleted from original text)
 * - type: 'added' | 'removed' | 'unchanged'
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
