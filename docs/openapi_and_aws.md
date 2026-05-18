# OpenAPI and AWS API Gateway Transition Plan

This document outlines the plan to convert the NRDS server into an OpenAPI-compliant Schema Translation Service designed to run on AWS with a preference for runtimeless architecture.

## Architectural Mantra: "Runtimeless"
- **Preference 1**: AWS API Gateway VTL (Velocity Mapping Templates) for direct integration where possible (e.g., Auth, Simple CRUD to DynamoDB).
- **Preference 2**: AWS Lambda (Node.js v26) only where VTL is insufficient.
- **Preference 3**: Lambda Durable Functions are preferred over Step Functions for complex orchestration.
- **Infrastructure**: All infrastructure defined via AWS CDK in TypeScript.

## Generic Schema Translation Service Routes

| Path | Method | Functionality | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| `/login` | POST | User login | Native AWS Auth (Cognito/APIGW) |
| `/accounts` | POST | Create account | Native AWS Auth / VTL to Backend |
| `/records/{schemaId}` | GET | List records | VTL Proxy or Lambda |
| `/records/{schemaId}` | POST | Create record | VTL Proxy or Lambda |
| `/records/{schemaId}/{id}` | GET | Get record | VTL Proxy or Lambda |
| `/records/{schemaId}/{id}` | PUT | Update record | VTL Proxy or Lambda |
| `/search` | POST | Search records | Lambda |

## OpenAPI Specification (OAS 3.0)

We will create an `openapi.yaml` file that defines these endpoints.

### Native AWS Authentication
Security will be handled using native AWS API Gateway Authorizers (Cognito User Pools or Lambda Authorizers) specified in the OpenAPI spec:
```yaml
components:
  securitySchemes:
    CognitoAuthorizer:
      type: apiKey
      name: Authorization
      in: header
      x-amazon-apigateway-authtype: cognito_user_pools
      x-amazon-apigateway-authorizer:
        type: cognito_user_pools
        providerARNs:
          - Fn::GetAtt: [ MyUserPool, Arn ]
```

## AWS Integration Strategy: VTL First

1.  **VTL Mapping**:
    - For simple pass-throughs to DynamoDB, use VTL templates in API Gateway to transform the incoming request body and headers.
    - Removes the need for Lambda execution for simple operations.
2.  **Lambda Fallback**:
    - For complex logic (e.g., search, complex translations), use Lambda functions running Node.js v26.
3.  **Static Content**:
    - Static files (e.g., `login.html`) are moved to S3 + CloudFront.

## Implementation Steps

1.  **Define OpenAPI Spec**:
    - Author `docs/openapi.yaml` including `x-amazon-apigateway-integration` for VTL or Lambda.
2.  **CDK Infrastructure**:
    - Use AWS CDK (TypeScript) to define API Gateway, S3, CloudFront, and any necessary Lambda/Cognito resources.
3.  **Native TypeScript (Node 26)**:
    - All Lambda code written in native TypeScript for Node.js v26.
