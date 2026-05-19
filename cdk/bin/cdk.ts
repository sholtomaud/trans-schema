#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TransSchemaApiStack } from '../lib/api-stack.ts';
import { TransSchemaWebsiteStack } from '../lib/website-stack.ts';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const apiStack = new TransSchemaApiStack(app, 'TransSchemaApiStack', { env });

new TransSchemaWebsiteStack(app, 'TransSchemaWebsiteStack', {
  env,
  api: apiStack.api,
});
