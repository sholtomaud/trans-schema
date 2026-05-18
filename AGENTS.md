# Agent Instructions - NRDS Server

## Architectural Mantra: "Runtimeless"
Our primary goal is to minimize runtimes. Favor managed services and configuration over custom code execution.

### Preferences Hierarchy:
1.  **VTL Over Lambda**: Always attempt to implement request/response mapping and simple logic using AWS API Gateway VTL (Velocity Mapping Templates) before falling back to AWS Lambda.
2.  **Lambda Durable Functions Over Step Functions**: For complex orchestration within the Node.js environment, prefer Lambda-based durable logic/patterns where applicable before using AWS Step Functions.
3.  **Native AWS Auth**: Use native API Gateway/Cognito integration for authentication and login. Avoid custom Lambda-based auth logic unless strictly necessary.

### Runtime Environment:
- **Node.js v26+**: All code must target Node.js v26, utilizing its native TypeScript support. No extra build steps or switches for TS execution.
- **Native Only**: No external npm dependencies unless absolutely unavoidable. Use built-in Node.js modules (`crypto`, `fetch`, `http`, `fs`, etc.).

### Infrastructure as Code:
- **AWS CDK**: Use TypeScript-based AWS CDK for all infrastructure definitions.
