import { test } from 'node:test';
import assert from 'node:assert';
import { hashPassword, verifyPassword } from '../lib/auth.ts';
import { IncomingMessage } from 'node:http';
import { EventEmitter } from 'node:events';
import { parseJsonBody } from '../lib/requestParser.ts';

test('auth - hash and verify password', async () => {
  const password = 'mysecretpassword';
  const hash = await hashPassword(password);
  assert.ok(hash.includes(':'), 'Hash should contain salt separator');

  const isValid = await verifyPassword(password, hash);
  assert.strictEqual(isValid, true, 'Valid password should be verified');

  const isInvalid = await verifyPassword('wrongpassword', hash);
  assert.strictEqual(isInvalid, false, 'Wrong password should fail verification');
});

test('requestParser - parse JSON body', async () => {
  const req = new EventEmitter() as any as IncomingMessage;
  const bodyPromise = parseJsonBody<{ foo: string }>(req);

  req.emit('data', Buffer.from(JSON.stringify({ foo: 'bar' })));
  req.emit('end');

  const result = await bodyPromise;
  assert.deepStrictEqual(result, { foo: 'bar' });
});
