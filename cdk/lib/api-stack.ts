import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TransSchemaApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

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

    // API Gateway Role for DynamoDB
    const apigwRole = new iam.Role(this, 'ApiGatewayRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    recordsTable.grantReadWriteData(apigwRole);
    schemasTable.grantReadWriteData(apigwRole);
    translationsTable.grantReadWriteData(apigwRole);
    viewsTable.grantReadWriteData(apigwRole);

    // API Gateway (RestApi) from OpenAPI Spec
    const openApiAssetPath = path.join(__dirname, '../../docs/openapi.json');
    const rawOpenApi = fs.readFileSync(openApiAssetPath, 'utf8');

    const processedOpenApi = rawOpenApi
      .replace(/\${AWS_REGION}/g, this.region)
      .replace(/\${APIGW_ROLE_ARN}/g, apigwRole.roleArn)
      .replace(/\${RECORDS_TABLE}/g, recordsTable.tableName)
      .replace(/\${SCHEMAS_TABLE}/g, schemasTable.tableName)
      .replace(/\${TRANSLATIONS_TABLE}/g, translationsTable.tableName)
      .replace(/\${USER_POOL_ARN}/g, userPool.userPoolArn);

    this.api = new apigateway.SpecRestApi(this, 'TransSchemaApi', {
      apiDefinition: apigateway.ApiDefinition.fromInline(JSON.parse(processedOpenApi)),
      deployOptions: { stageName: 'prod' }
    });

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'ApiUrl', { value: this.api.url });
  }
}
