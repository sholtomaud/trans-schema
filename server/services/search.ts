import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "../lib/logger.ts";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.RECORDS_TABLE || 'RecordsTable';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Search request received', { body: event.body });

  const body = JSON.parse(event.body || '{}');
  const { query, schemaId } = body;

  if (!query || !schemaId) {
    logger.warn('Missing query or schemaId in search request');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query or schemaId' }),
    };
  }

  try {
    const result = await ddbDocClient.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: 'schemaId = :s AND contains(#d, :q)',
      ExpressionAttributeNames: { '#d': 'data' },
      ExpressionAttributeValues: {
        ':s': schemaId,
        ':q': query,
      },
    }));

    logger.info('Search successful', { count: result.Items?.length });

    return {
      statusCode: 200,
      body: JSON.stringify({ items: result.Items }),
    };
  } catch (error) {
    logger.error('Search error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
