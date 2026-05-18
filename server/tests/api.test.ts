import { test } from 'node:test';
import assert from 'node:assert';
import { Router } from '../lib/router.ts';
import { ServerResponse } from 'node:http';

test('router - match routes', async () => {
  const router = new Router();
  let handled = false;

  router.add('GET', '/test/:id', async (req, res, params) => {
    handled = true;
    assert.strictEqual(params.id, '123');
  });

  const req = {
    method: 'GET',
    url: '/test/123',
    headers: { host: 'localhost' }
  } as any;

  const res = {} as any;

  const result = await router.handle(req, res);
  assert.strictEqual(result, true, 'Router should match the route');
  assert.strictEqual(handled, true, 'Handler should be called');
});

test('router - no match', async () => {
  const router = new Router();
  const req = {
    method: 'POST',
    url: '/test/123',
    headers: { host: 'localhost' }
  } as any;

  const res = {} as any;
  const result = await router.handle(req, res);
  assert.strictEqual(result, false, 'Router should not match for different method');
});
