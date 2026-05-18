#!/usr/bin/env node
import 'source-map-support/register.js';
import * as cdk from 'aws-cdk-lib';
import { TransSchemaStack } from '../lib/trans-schema-stack.js';

const app = new cdk.App();
new TransSchemaStack(app, 'TransSchemaStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
