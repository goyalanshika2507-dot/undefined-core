import test from 'node:test';
import assert from 'node:assert';
import app from '../src/index.js';
import { calculateDiff } from '../../src/lib/diff.js';
import { calculateMetrics } from '../../src/lib/metrics.js';

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

test('Frontend integration: Health check matches frontend client expectations', async () => {
  const res = await fetch(`${baseUrl}/api/health`, {
    headers: { Accept: 'application/json' }
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(typeof data.configured, 'boolean');
});

test('Frontend integration: POST /api/rewrite accepts Agrim UI payload and returns frontend-ready structure', async () => {
  process.env.MOCK_LLM = 'true';

  // Exact payload structure constructed by Agrim's WritePage.jsx
  const frontendPayload = {
    message: 'Hey team, prod release might slip to Friday due to auth test blocker #402.',
    tone: 'Professional',
    audience: 'Executive / C-Level',
    channel: 'Chat / Direct Message',
    length: 'Shorter',
    targetWords: 35,
    language: 'English',
    preset: 'Executive C-Level'
  };

  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(frontendPayload)
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();

  // 1. Check versions
  assert.ok(Array.isArray(data.versions), 'data.versions must be an array');
  assert.strictEqual(data.versions.length, 3, 'Must return exactly 3 versions');

  for (const v of data.versions) {
    // Required by Master spec
    assert.ok(v.label, 'Version must have a label');
    assert.ok(v.text, 'Version must have rewritten text');
    assert.ok(v.whatChanged, 'Version must have whatChanged');

    // Required by Agrim's VersionCard component
    assert.ok(v.id, 'Version must have an id');
    assert.ok(v.styleDescription, 'Version must have styleDescription');

    // Test that client diff metrics calculate without error on this version
    const metrics = calculateMetrics(frontendPayload.message, v.text);
    assert.ok(metrics.rewrittenWordCount > 0);
    assert.ok(typeof metrics.changePercentage === 'number');

    const diff = calculateDiff(frontendPayload.message, v.text);
    assert.ok(Array.isArray(diff.originalSegments));
    assert.ok(Array.isArray(diff.rewrittenSegments));
  }

  // 2. Check CommunicationInsights expectations
  assert.ok(data.insights, 'data.insights must be provided for CommunicationInsights component');
  assert.ok(data.insights.toneShift, 'insights must have toneShift');
  assert.ok(data.insights.clarity, 'insights must have clarity');
  assert.ok(data.insights.directness, 'insights must have directness');
  assert.ok(data.insights.audienceFit, 'insights must have audienceFit');
  assert.ok(Array.isArray(data.insights.keyChanges), 'insights must have keyChanges array');
  assert.ok(data.insights.meaningCheck, 'insights must have meaningCheck');
  assert.ok(Array.isArray(data.insights.meaningCheck.preservedFacts), 'meaningCheck must have preservedFacts');

  delete process.env.MOCK_LLM;
});

test('Frontend integration: Error response formatting provides understandable messages', async () => {
  const res = await fetch(`${baseUrl}/api/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '   ' })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();

  // Both error.message and top-level message exist to avoid [object Object] in UI
  assert.ok(data.error);
  assert.ok(data.message);
  assert.strictEqual(typeof data.message, 'string');
});
