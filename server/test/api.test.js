import test from 'node:test';
import assert from 'node:assert';
import app from '../src/index.js';

let server;
let baseUrl;

test.before((t, done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    done();
  });
});

test.after((t, done) => {
  server.close(done);
});

test('GET /api/health returns HTTP 200 with safe status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);

  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(typeof data.configured, 'boolean');
  // Must NOT expose secret keys
  assert.strictEqual(data.apiKey, undefined);
  assert.strictEqual(data.LLM_API_KEY, undefined);
});

test('POST /api/rewrite returns HTTP 400 when text is empty', async () => {
  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '   ' })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'VALIDATION_ERROR');
  assert.ok(data.error.message.includes('Draft text cannot be empty'));
});

test('POST /api/rewrite returns HTTP 400 when text exceeds 2000 words', async () => {
  const overLimit = Array(2005).fill('test').join(' ');
  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: overLimit })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'VALIDATION_ERROR');
  assert.ok(data.error.message.includes('2,000 words'));
});

test('POST /api/rewrite returns HTTP 400 for invalid tone or audience', async () => {
  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Valid draft', tone: 'NonExistentTone' })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'VALIDATION_ERROR');
});

test('POST /api/rewrite returns HTTP 400 when Custom tone lacks customTone instruction', async () => {
  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Valid draft', tone: 'Custom', customTone: '' })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'VALIDATION_ERROR');
  assert.ok(data.error.message.includes('Custom tone'));
});

test('POST /api/rewrite with MOCK_LLM=true produces exactly three valid versions', async () => {
  process.env.MOCK_LLM = 'true';

  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Please review the attached spreadsheet by 3 PM.',
      tone: 'Professional',
      audience: 'Manager',
      preset: 'executive',
      length: 'shorter'
    })
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.versions));
  assert.strictEqual(data.versions.length, 3);

  for (const v of data.versions) {
    assert.ok(v.label && typeof v.label === 'string');
    assert.ok(v.text && typeof v.text === 'string');
    assert.ok(v.whatChanged && typeof v.whatChanged === 'string');
  }

  delete process.env.MOCK_LLM;
});

test('POST /api/rewrite returns 503 when LLM_API_KEY is not configured and mock is off', async () => {
  const originalKey = process.env.LLM_API_KEY;
  delete process.env.LLM_API_KEY;
  delete process.env.MOCK_LLM;

  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Need a rewrite' })
  });

  assert.strictEqual(res.status, 503);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'CONFIG_MISSING');
  assert.ok(data.error.message.includes('LLM_API_KEY'));

  if (originalKey) process.env.LLM_API_KEY = originalKey;
});

test('GET unknown endpoint returns HTTP 404 with structured error', async () => {
  const res = await fetch(`${baseUrl}/api/nonexistent`);
  assert.strictEqual(res.status, 404);
  const data = await res.json();
  assert.strictEqual(data.error.code, 'NOT_FOUND');
});
