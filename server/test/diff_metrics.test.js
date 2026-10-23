import test from 'node:test';
import assert from 'node:assert';
import { computeWordDiff } from '../../src/lib/diff.js';
import { computeChangeMetrics, countWords } from '../../src/lib/metrics.js';

test('diff and metrics correctly handle identical text', () => {
  const text = 'This is a test message.';
  const diff = computeWordDiff(text, text);
  assert.strictEqual(diff.length, 1);
  assert.strictEqual(diff[0].type, 'unchanged');

  const metrics = computeChangeMetrics(text, text);
  assert.strictEqual(metrics.originalWordCount, 5);
  assert.strictEqual(metrics.rewrittenWordCount, 5);
  assert.strictEqual(metrics.wordCountDelta, 0);
  assert.strictEqual(metrics.addedWordCount, 0);
  assert.strictEqual(metrics.removedWordCount, 0);
  assert.strictEqual(metrics.changePercent, 0);
  assert.strictEqual(metrics.lexicalSimilarity, 100);
});

test('diff and metrics calculate actual additions and deletions', () => {
  const original = 'Please send the documents today.';
  const rewritten = 'Please email the files today.';

  const diff = computeWordDiff(original, rewritten);
  assert.ok(diff.some(d => d.removed && d.value.includes('send')));
  assert.ok(diff.some(d => d.added && d.value.includes('email')));

  const metrics = computeChangeMetrics(original, rewritten);
  assert.strictEqual(metrics.originalWordCount, 5);
  assert.strictEqual(metrics.rewrittenWordCount, 5);
  // 'send the documents' vs 'email the files' -> additions and deletions
  assert.ok(metrics.addedWordCount > 0);
  assert.ok(metrics.removedWordCount > 0);
  assert.ok(metrics.changePercent > 0);
  assert.ok(metrics.lexicalSimilarity < 100);
});

test('diff and metrics formula matches documented specification', () => {
  const original = 'One two three four';
  const rewritten = 'One two five six';
  const metrics = computeChangeMetrics(original, rewritten);

  // Original: 4 words. Removed: 2 ('three four'). Added: 2 ('five six').
  // changePercent = 100 * (2 + 2) / 4 = 100%
  assert.strictEqual(metrics.originalWordCount, 4);
  assert.strictEqual(metrics.addedWordCount, 2);
  assert.strictEqual(metrics.removedWordCount, 2);
  assert.strictEqual(metrics.changePercent, 100);
  assert.strictEqual(metrics.lexicalSimilarity, 0);
});
