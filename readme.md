# Trans-Schema: Schema Translation Service

Trans-Schema is a generic Schema Translation Service designed for high performance, scalability, and minimal maintenance. It provides a standardized API for managing, searching, and translating structured records across various schemas.

## Concept: Runtimeless Architecture

The "Trans-Schema" project is built on the **Runtimeless** mantra. We prioritize AWS managed services and direct integrations over custom code execution to reduce latency, cost, and maintenance overhead.

### Architectural Principles:

1.  **VTL First**: We utilize AWS API Gateway Velocity Mapping Templates (VTL) for direct integration with backend services like Amazon DynamoDB. This allows for high-performance CRUD operations without the overhead of a Lambda cold start.
2.  **Native AWS Auth**: Authentication and authorization are handled natively by AWS Cognito and API Gateway Authorizers.
3.  **Minimalist Lambda**: AWS Lambda is used only for complex orchestration or logic that cannot be expressed in VTL. All Lambda functions target **Node.js v26+** and use native TypeScript.
4.  **Zero External Dependencies**: The service is designed to run using only the built-in modules of the Node.js runtime (e.g., `crypto`, `fetch`, `http`). This eliminates security vulnerabilities and dependency bloat.

## How it Works

1.  **OpenAPI Defined**: The entire service surface area is defined in an OpenAPI 3.0 specification (`docs/openapi.yaml`).
2.  **Infrastructure as Code**: The service is deployed using AWS CDK (Cloud Development Kit), ensuring reproducible and version-controlled infrastructure.
3.  **Schema-Agnostic**: Records are stored and retrieved based on `schemaId`, allowing the service to handle diverse data structures through a unified interface.
4.  **Direct Persistence**: Most API requests are transformed by API Gateway via VTL directly into DynamoDB operations, bypassing the need for an intermediate compute layer.

## Project Structure

- `docs/`: Documentation including the migration plan and OpenAPI specification.
- `server/`: Source code for native core utilities and Lambda handlers.
- `public/`: Static frontend assets, served via S3 and CloudFront.

## Getting Started

Refer to `docs/TODO_MIGRATION.md` for the step-by-step implementation guide to transition from the legacy GFC-based server to the new Trans-Schema architecture.
