import test from 'node:test';
import assert from 'node:assert';
import { extractAndParseJSON, validateModelOutput, generateMockRewrite } from '../src/lib/llm.js';

test('extractAndParseJSON parses valid JSON string', () => {
  const jsonStr = JSON.stringify({
    versions: [
      { label: 'Version 1', text: 'Text 1', whatChanged: 'Changed 1' },
      { label: 'Version 2', text: 'Text 2', whatChanged: 'Changed 2' },
      { label: 'Version 3', text: 'Text 3', whatChanged: 'Changed 3' }
    ]
  });

  const parsed = extractAndParseJSON(jsonStr);
  assert.strictEqual(parsed.versions.length, 3);
});

test('extractAndParseJSON defensively strips markdown code fences', () => {
  const fenced = '```json\n{"versions":[{"label":"V1","text":"T1","whatChanged":"C1"},{"label":"V2","text":"T2","whatChanged":"C2"},{"label":"V3","text":"T3","whatChanged":"C3"}]}\n```';
  const parsed = extractAndParseJSON(fenced);
  assert.strictEqual(parsed.versions.length, 3);
  assert.strictEqual(parsed.versions[0].label, 'V1');
});

test('extractAndParseJSON extracts JSON surrounded by conversational prose', () => {
  const surrounded = 'Here are your requested rewrites:\n{"versions":[{"label":"V1","text":"T1","whatChanged":"C1"},{"label":"V2","text":"T2","whatChanged":"C2"},{"label":"V3","text":"T3","whatChanged":"C3"}]}\nHope this helps!';
  const parsed = extractAndParseJSON(surrounded);
  assert.strictEqual(parsed.versions.length, 3);
});

test('extractAndParseJSON throws clear error on malformed non-JSON', () => {
  assert.throws(() => {
    extractAndParseJSON('This is completely invalid text without braces');
  }, /Failed to parse/);
});

test('validateModelOutput succeeds for valid 3 versions', () => {
  const valid = {
    versions: [
      { label: 'V1', text: 'T1', whatChanged: 'C1' },
      { label: 'V2', text: 'T2', whatChanged: 'C2' },
      { label: 'V3', text: 'T3', whatChanged: 'C3' }
    ]
  };

  const validated = validateModelOutput(valid);
  assert.strictEqual(validated.versions.length, 3);
});

test('validateModelOutput throws when versions count is not 3', () => {
  const invalid = {
    versions: [
      { label: 'V1', text: 'T1', whatChanged: 'C1' }
    ]
  };

  assert.throws(() => {
    validateModelOutput(invalid);
  }, /schema validation failed/);
});

test('generateMockRewrite returns three valid versions', () => {
  const mockRes = generateMockRewrite({
    text: 'Please submit invoices before Friday.',
    tone: 'Professional',
    audience: 'Manager'
  });

  assert.strictEqual(mockRes.versions.length, 3);
  const validated = validateModelOutput(mockRes);
  assert.strictEqual(validated.versions.length, 3);
});
