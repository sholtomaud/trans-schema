# Dependency Audit and Remediation Plan

This document outlines the audit of existing dependencies in the `nrds-server` repository and provides a plan to replace them with native Node.js and TypeScript functionality.

**Target Runtime:** Node.js v26+ (utilizing native TypeScript support without additional switches or options).

## Dependency Audit

| Dependency | Purpose | Native Replacement Strategy |
| :--- | :--- | :--- |
| `bcrypt` | Password hashing | Use Node.js native `crypto.scrypt` or `crypto.pbkdf2`. |
| `bunyan` | Logging | Use native `console` or a simple `util.debuglog` implementation. |
| `crypto` | Cryptography | Node.js has built-in `crypto` module; remove `package.json` entry. |
| `dion` / `file-server` | Static file serving | Use native `fs.createReadStream` and `http` module. |
| `flat-merge-n` | Object merging | Use native `Object.assign()` or the spread operator `{...a, ...b}`. |
| `generic-errors` | Error handling | Use native TypeScript `class MyError extends Error`. |
| `jayschema` | Schema validation | Replace with TypeScript interfaces and manual runtime validation (type guards). |
| `kgo` | Async flow control | Replace with native `async/await` and `Promise.all`. |
| `request` | HTTP Client | Use native `fetch` (Node 18+) or `https.request`. |
| `request-data` | Body parsing | Use native stream listeners (`req.on('data', ...)`). |
| `retort` | Response helpers | Create a simple internal `responder` module using `res.writeHead` and `res.end`. |
| `sea-lion` | Routing | Implement a simple router using `new URL(request.url).pathname`. |
| `simple-cors` | CORS handling | Manually set `Access-Control-Allow-*` headers in a middleware function. |
| `wraperr` | Error wrapping | Use standard try/catch blocks. |
| `gfc-node` | GFC Client | (Used but missing from package.json) Replace with native `fetch` calls to the GFC API. |

## Remediation Steps

1.  **TypeScript Configuration**:
    - Configure for Node.js v26 native TypeScript support.
    - Define core interfaces for the Schema Translation Service (Account, Site, Menu, and Control).
2.  **Core Utilities**:
    - Create a native `logger.ts`.
    - Create a native `router.ts` to replace `sea-lion`.
    - Create a native `requestParser.ts` to replace `request-data`.
    - Create a native `responder.ts` to replace `retort`.
3.  **Persistence Layer**:
    - Refactor `server/persistence/gfc/` to use native `https` or `fetch` instead of `gfc-node`.
    - Replace callback patterns with `Promises`.
4.  **Service Layer**:
    - Refactor `server/services/` to use `async/await`.
    - Replace `bcrypt` with `crypto.scrypt`.
    - Replace `kgo` flow control with standard `async` logic.
5.  **Router Layer**:
    - Update all route handlers to use the new native router and responder.
6.  **Cleanup**:
    - Uninstall all dependencies.
    - Remove `node_modules`.
    - Verify with `tsc`.
