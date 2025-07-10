import AWS from 'aws-sdk';
import { config } from '../config';

// Configure AWS
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

export const dynamodb = new AWS.DynamoDB();
export const docClient = new AWS.DynamoDB.DocumentClient();

export default { dynamodb, docClient };
