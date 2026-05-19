import { test } from 'node:test';
import * as assert from 'node:assert';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TransSchemaApiStack } from '../../cdk/lib/api-stack.ts';
import { TransSchemaWebsiteStack } from '../../cdk/lib/website-stack.ts';

test('TransSchemaWebsiteStack matches snapshot', () => {
  const app = new cdk.App();
  const apiStack = new TransSchemaApiStack(app, 'ApiStack');
  const websiteStack = new TransSchemaWebsiteStack(app, 'WebsiteStack', {
    api: apiStack.api
  });
  const template = Template.fromStack(websiteStack);

  // Verify S3 Bucket
  template.resourceCountIs('AWS::S3::Bucket', 1);

  // Verify CloudFront Distribution
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
        DefaultRootObject: 'index.html'
    }
  });
});
