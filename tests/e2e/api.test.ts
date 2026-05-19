import { test } from 'node:test';
import * as assert from 'node:assert';

const API_URL = process.env.API_URL;

test('API E2E: Health Check / login mock', { skip: !API_URL }, async () => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ username: 'test', password: 'password' }),
    headers: { 'Content-Type': 'application/json' }
  });

  assert.strictEqual(response.status, 200);
  const data = await response.json() as { message: string };
  assert.ok(data.message.includes('Login via Cognito recommended'));
});

test('API E2E: List Schemas (requires Auth)', { skip: !API_URL }, async () => {
  const response = await fetch(`${API_URL}/schemas`);
  // Expecting 401/403 if no auth provided
  assert.ok(response.status === 401 || response.status === 403);
});
