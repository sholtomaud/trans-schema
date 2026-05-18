import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TransSchemaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    const recordsTable = new dynamodb.Table(this, 'RecordsTable', {
      partitionKey: { name: 'schemaId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const schemasTable = new dynamodb.Table(this, 'SchemasTable', {
      partitionKey: { name: 'schemaId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translationsTable = new dynamodb.Table(this, 'TranslationsTable', {
      partitionKey: { name: 'translationId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const viewsTable = new dynamodb.Table(this, 'ViewsTable', {
      partitionKey: { name: 'viewId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { username: true, email: true },
      autoVerify: { email: true },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient('UserPoolClient', {
      authFlows: {
        adminNoSrp: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    // S3 Bucket for static assets
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Search Lambda
    const searchLambda = new nodejs.NodejsFunction(this, 'SearchHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../server/services/search.ts'),
      handler: 'handler',
      environment: {
        RECORDS_TABLE: recordsTable.tableName,
      },
    });
    recordsTable.grantReadData(searchLambda);

    // API Gateway Role for DynamoDB and Lambda
    const apigwRole = new iam.Role(this, 'ApiGatewayRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    recordsTable.grantReadWriteData(apigwRole);
    schemasTable.grantReadWriteData(apigwRole);
    translationsTable.grantReadWriteData(apigwRole);
    viewsTable.grantReadWriteData(apigwRole);
    searchLambda.grantInvoke(apigwRole);

    // API Gateway (RestApi) from OpenAPI Spec
    const openApiAssetPath = path.join(__dirname, '../../docs/openapi.yaml');
    const rawOpenApi = fs.readFileSync(openApiAssetPath, 'utf8');

    // Manual replacement as js-yaml is not installed and we want to keep it runtimeless
    const processedOpenApi = rawOpenApi
      .replace(/\${AWS_REGION}/g, this.region)
      .replace(/\${APIGW_ROLE_ARN}/g, apigwRole.roleArn)
      .replace(/\${RECORDS_TABLE}/g, recordsTable.tableName)
      .replace(/\${SCHEMAS_TABLE}/g, schemasTable.tableName)
      .replace(/\${TRANSLATIONS_TABLE}/g, translationsTable.tableName)
      .replace(/\${SEARCH_HANDLER_ARN}/g, searchLambda.functionArn)
      .replace(/\${USER_POOL_ARN}/g, userPool.userPoolArn);

    const api = new apigateway.SpecRestApi(this, 'TransSchemaApi', {
      apiDefinition: apigateway.ApiDefinition.fromInline(yaml.load(processedOpenApi)),
      deployOptions: { stageName: 'prod' }
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/prod/*': {
          origin: new origins.RestApiOrigin(api),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      defaultRootObject: 'index.html',
    });

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'WebsiteUrl', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}
