import dotenv from 'dotenv';

dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  dynamodb: {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'users',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    apiKey: process.env.API_KEY ,
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
