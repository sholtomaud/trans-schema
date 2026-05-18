# Migration TODO List: trans-schema Service

This TODO list outlines the steps required for an LLM agent to implement the new "Runtimeless" Schema Translation Service, as defined in `audit_and_remediation.md` and `openapi_and_aws.md`.

## Phase 1: Environment & Infrastructure Setup
- [ ] **Configure TypeScript**: Update `tsconfig.json` to target Node.js v26 native TypeScript support.
- [ ] **Initialize AWS CDK**: Create a `cdk/` directory and initialize a TypeScript CDK project.
- [ ] **Define Base Infrastructure**:
    - [ ] Cognito User Pool for native authentication.
    - [ ] DynamoDB tables for Accounts, Records, and Schemas.
    - [ ] S3 bucket and CloudFront distribution for static assets (`public/`).
    - [ ] AWS API Gateway (REST API) to host the OpenAPI spec.

## Phase 2: API Definition & Security
- [ ] **Author OpenAPI Spec**: Create `docs/openapi.yaml` (OAS 3.0).
    - [ ] Define endpoints: `/login`, `/accounts`, `/records/{schemaId}`, `/search`.
    - [ ] Integrate Cognito Authorizer.
    - [ ] Add `x-amazon-apigateway-integration` extensions for VTL and Lambda.

## Phase 3: Native Core Utilities (No Dependencies)
- [ ] **Implement `server/lib/logger.ts`**: Using native `console` and `util.debuglog`.
- [ ] **Implement `server/lib/router.ts`**: Native routing logic using `URL` API.
- [ ] **Implement `server/lib/requestParser.ts`**: Native body parsing for streams.
- [ ] **Implement `server/lib/responder.ts`**: Helper for native `http` response handling.
- [ ] **Implement `server/lib/auth.ts`**: Native crypto utilities using `crypto.scrypt` (replacing `bcrypt`).

## Phase 4: Runtimeless Logic (VTL)
- [ ] **Implement VTL Mapping Templates**:
    - [ ] `GET /records/{schemaId}` -> DynamoDB `Query`.
    - [ ] `POST /records/{schemaId}` -> DynamoDB `PutItem`.
    - [ ] `GET /records/{schemaId}/{id}` -> DynamoDB `GetItem`.
    - [ ] `PUT /records/{schemaId}/{id}` -> DynamoDB `UpdateItem`.

## Phase 5: Lambda Implementation (Node.js v26 Native)
- [ ] **Refactor Search Service**: Implement `POST /search` as a Lambda function using native `fetch` and AWS SDK v3.
- [ ] **Refactor Complex Logic**: Any business logic from `server/services/` that cannot be handled by VTL.
- [ ] **Ensure Async/Await**: Convert all legacy `kgo` or callback-based logic to native `async/await`.

## Phase 6: Frontend Migration
- [ ] **Deploy Static Assets**: Move `public/` contents to S3.
- [ ] **Update Frontend API Calls**: Point the client to the new APIGW endpoints.

## Phase 7: Cleanup & De-dependency
- [ ] **Remove GFC Integration**: Delete `server/persistence/gfc/`.
- [ ] **Uninstall All Dependencies**: `npm uninstall` every package listed in `package.json`.
- [ ] **Delete `node_modules`**: Ensure the app runs purely on Node.js v26 built-ins.
- [ ] **Final Type Check**: Run `tsc` to verify everything is valid TypeScript.

## Phase 8: Verification & Testing
- [ ] **Unit Tests**: Write native tests for core utilities.
- [ ] **Integration Tests**: Verify APIGW -> VTL -> DynamoDB flow.
- [ ] **Security Audit**: Ensure Cognito authorizers are correctly protecting routes.
