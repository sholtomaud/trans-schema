# OpenAPI and AWS API Gateway Transition Plan

This document outlines the plan to convert the NRDS server into an OpenAPI-compliant application designed to run on AWS Lambda behind an AWS API Gateway.

## Current Route Mapping

| Path | Method | Functionality | Current Implementation |
| :--- | :--- | :--- | :--- |
| `/login` | GET | Serve login.html | `fileServer.serveFile` |
| `/login` | POST | User login | `authenticationService.login` |
| `/accounts` | POST | Create account | `authenticationService.createAccount` |
| `/sites` | GET | List all sites | `siteService.getAllSites` |
| `/sites` | POST | Create site | `siteService.create` |
| `/sites/{siteId}` | GET | Get site details | `siteService.get` |
| `/sites/{siteId}` | PUT | Update site | `siteService.update` |
| `/search` | POST | Search sites | `searchService.searchSites` |
| `/controls` | POST | Get controls | `controlsService.getControls` |
| `/menus` | POST | Get menus | `menusService.getMenus` |

## OpenAPI Specification (OAS 3.0)

We will create an `openapi.yaml` file that defines these endpoints. Security will be handled via `BearerAuth` (mapping to the `Authorization` header).

### Key Components:
- **Security Schemes**: JWT/Token based Authentication.
- **Paths**: Defined based on the table above.
- **AWS Extensions**: `x-amazon-apigateway-integration` will be used to link paths to a single Lambda proxy or multiple Lambda functions.

## AWS Integration Strategy: Lambda Proxy

1.  **Lambda Entry Point**:
    - Create a `handler.ts` that receives the API Gateway Proxy Event.
    - The handler will parse the `event.path` and `event.httpMethod` and dispatch to the appropriate service logic.
2.  **Response Format**:
    - Lambda will return the standard AWS Proxy response:
      ```json
      {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": "..."
      }
      ```
3.  **Static Content**:
    - Move static files (`public/`) to an S3 bucket with CloudFront. API Gateway will only handle API requests.

## Implementation Steps

1.  **Define OpenAPI Spec**:
    - Author `docs/openapi.yaml`.
2.  **AWS Lambda Adapter**:
    - Implement a shim to convert API Gateway events into the internal request format (or refactor services to be event-agnostic).
3.  **Deployment Configuration**:
    - Use a framework like SAM, CDK, or Serverless to define the API Gateway and Lambda resources.
    - Configure API Gateway to import the OpenAPI specification.
4.  **Environment Configuration**:
    - Use AWS Lambda Environment Variables to replace `config/local.js`.
