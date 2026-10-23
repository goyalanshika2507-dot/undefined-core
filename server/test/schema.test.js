import test from 'node:test';
import assert from 'node:assert';
import {
  rewriteRequestSchema,
  modelOutputSchema,
  ALLOWED_TONES,
  ALLOWED_AUDIENCES,
  ALLOWED_CHANNELS,
  ALLOWED_PRESETS,
  ALLOWED_LENGTHS,
  ALLOWED_LANGUAGES,
  countWords
} from '../src/lib/schema.js';

test('countWords accurately counts words', () => {
  assert.strictEqual(countWords(''), 0);
  assert.strictEqual(countWords('   '), 0);
  assert.strictEqual(countWords('Hello world'), 2);
  assert.strictEqual(countWords('  One   two   three  '), 3);
});

test('rewriteRequestSchema rejects missing or whitespace-only drafts', () => {
  const emptyRes = rewriteRequestSchema.safeParse({ text: '' });
  assert.strictEqual(emptyRes.success, false);

  const whitespaceRes = rewriteRequestSchema.safeParse({ text: '    \n   ' });
  assert.strictEqual(whitespaceRes.success, false);
});

test('rewriteRequestSchema rejects drafts exceeding 2000 words', () => {
  const overLimitText = Array(2001).fill('word').join(' ');
  const res = rewriteRequestSchema.safeParse({ text: overLimitText });
  assert.strictEqual(res.success, false);
  assert.match(res.error.errors[0].message, /2,000 words/);
});

test('rewriteRequestSchema accepts valid input with defaults', () => {
  const res = rewriteRequestSchema.safeParse({ text: 'Please review the quarterly report.' });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.tone, 'Professional');
  assert.strictEqual(res.data.audience, 'Manager');
  assert.strictEqual(res.data.length, 'same');
  assert.strictEqual(res.data.language, 'English');
  assert.strictEqual(res.data.preset, null);
});

test('rewriteRequestSchema enforces Custom tone rules', () => {
  // Empty customTone with tone=Custom must fail
  const fail1 = rewriteRequestSchema.safeParse({
    text: 'Draft message',
    tone: 'Custom',
    customTone: ''
  });
  assert.strictEqual(fail1.success, false);

  // Whitespace-only customTone with tone=Custom must fail
  const fail2 = rewriteRequestSchema.safeParse({
    text: 'Draft message',
    tone: 'Custom',
    customTone: '   '
  });
  assert.strictEqual(fail2.success, false);

  // > 300 characters customTone must fail
  const longCustom = 'a'.repeat(301);
  const fail3 = rewriteRequestSchema.safeParse({
    text: 'Draft message',
    tone: 'Custom',
    customTone: longCustom
  });
  assert.strictEqual(fail3.success, false);

  // Valid customTone must succeed
  const pass = rewriteRequestSchema.safeParse({
    text: 'Draft message',
    tone: 'Custom',
    customTone: 'Speak like an encouraging mentor'
  });
  assert.strictEqual(pass.success, true);
});

test('rewriteRequestSchema validates targetWordLimit', () => {
  const zero = rewriteRequestSchema.safeParse({ text: 'Draft', targetWordLimit: 0 });
  assert.strictEqual(zero.success, false);

  const negative = rewriteRequestSchema.safeParse({ text: 'Draft', targetWordLimit: -5 });
  assert.strictEqual(negative.success, false);

  const float = rewriteRequestSchema.safeParse({ text: 'Draft', targetWordLimit: 25.5 });
  assert.strictEqual(float.success, false);

  const overLimit = rewriteRequestSchema.safeParse({ text: 'Draft', targetWordLimit: 2001 });
  assert.strictEqual(overLimit.success, false);

  const valid = rewriteRequestSchema.safeParse({ text: 'Draft', targetWordLimit: 50 });
  assert.strictEqual(valid.success, true);
});

test('rewriteRequestSchema validates allowed enum values', () => {
  const invalidTone = rewriteRequestSchema.safeParse({ text: 'Draft', tone: 'Angry' });
  assert.strictEqual(invalidTone.success, false);

  const invalidAudience = rewriteRequestSchema.safeParse({ text: 'Draft', audience: 'Aliens' });
  assert.strictEqual(invalidAudience.success, false);

  const invalidPreset = rewriteRequestSchema.safeParse({ text: 'Draft', preset: 'random' });
  assert.strictEqual(invalidPreset.success, false);

  const invalidLanguage = rewriteRequestSchema.safeParse({ text: 'Draft', language: 'Klingon' });
  assert.strictEqual(invalidLanguage.success, false);
});

test('modelOutputSchema validates exactly three complete versions', () => {
  const validOutput = {
    versions: [
      { label: 'Version 1', text: 'Rewrite one', whatChanged: 'Changed tone' },
      { label: 'Version 2', text: 'Rewrite two', whatChanged: 'More concise' },
      { label: 'Version 3', text: 'Rewrite three', whatChanged: 'Polished phrasing' }
    ]
  };
  const pass = modelOutputSchema.safeParse(validOutput);
  assert.strictEqual(pass.success, true);

  // Missing a version (only 2) must fail
  const failTwo = modelOutputSchema.safeParse({
    versions: validOutput.versions.slice(0, 2)
  });
  assert.strictEqual(failTwo.success, false);

  // Four versions must fail
  const failFour = modelOutputSchema.safeParse({
    versions: [...validOutput.versions, { label: 'Version 4', text: 'Extra', whatChanged: 'Extra' }]
  });
  assert.strictEqual(failFour.success, false);

  // Empty fields must fail
  const failEmptyField = modelOutputSchema.safeParse({
    versions: [
      { label: '', text: 'Text', whatChanged: 'Diff' },
      validOutput.versions[1],
      validOutput.versions[2]
    ]
  });
  assert.strictEqual(failEmptyField.success, false);
});
