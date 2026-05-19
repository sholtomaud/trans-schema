import { test } from 'node:test';
import * as assert from 'node:assert';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TransSchemaApiStack } from '../../cdk/lib/api-stack.ts';

test('TransSchemaApiStack matches snapshot', () => {
  const app = new cdk.App();
  const stack = new TransSchemaApiStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  // Verify DynamoDB Tables
  template.resourceCountIs('AWS::DynamoDB::Table', 4);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    KeySchema: [
      { AttributeName: 'schemaId', KeyType: 'HASH' },
      { AttributeName: 'id', KeyType: 'RANGE' }
    ]
  });

  // Verify Cognito User Pool
  template.resourceCountIs('AWS::Cognito::UserPool', 1);
  template.resourceCountIs('AWS::Cognito::UserPoolClient', 1);

  // Verify API Gateway
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'TransSchemaApi'
  });

  // Verify IAM Role for API Gateway
  // One for the explicitly created role, and possibly others for CDK-managed roles (e.g. for SpecRestApi/Cognito)
  template.resourceCountIs('AWS::IAM::Role', 2);
});
