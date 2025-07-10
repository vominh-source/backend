import { dynamodb, docClient } from '../config/database';
import { config } from '../config';
import { User } from '../types';

const tableName = config.dynamodb.tableName;

async function createTable(): Promise<void> {
  try {
    // Check if table already exists
    const existingTables = await dynamodb.listTables().promise();
    if (existingTables.TableNames?.includes(tableName)) {
      console.log(`✅ Table '${tableName}' already exists`);
      return;
    }

    const params = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'N', // Number type instead of String
        },
      ],
      BillingMode: 'PAY_PER_REQUEST', // Use on-demand billing (free tier friendly)
    };

    console.log(`🚀 Creating table '${tableName}'...`);
    await dynamodb.createTable(params).promise();
    
    // Wait for table to become active
    await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
    console.log(`✅ Table '${tableName}' created successfully`);
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

async function insertDummyData(): Promise<void> {
  const users: User[] = [
    {
      id: 1,
      username: 'john.doe',
      email: 'john.doe@email.com',
      birthdate: '1991-04-21',
    },
    {
      id: 2,
      username: 'john.smith',
      email: 'john.smith@email.com',
      birthdate: '1994-09-07',
    },
    {
      id: 3,
      username: 'jane.doe',
      email: 'jane.doe@email.com',
      birthdate: '1988-12-15',
    },
    {
      id: 4,
      username: 'alice.johnson',
      email: 'alice.johnson@email.com',
      birthdate: '1992-03-28',
    },
    {
      id: 5,
      username: 'bob.wilson',
      email: 'bob.wilson@email.com',
      birthdate: '1985-07-11',
    },
  ];

  try {
    console.log('📝 Inserting dummy data...');
    
    for (const user of users) {
      const params = {
        TableName: tableName,
        Item: user,
        ConditionExpression: 'attribute_not_exists(id)', // Only insert if not exists
      };

      try {
        await docClient.put(params).promise();
        console.log(`✅ Inserted user: ${user.username}`);
      } catch (error: any) {
        if (error.code === 'ConditionalCheckFailedException') {
          console.log(`⚠️  User ${user.username} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Dummy data insertion completed');
  } catch (error) {
    console.error('❌ Error inserting dummy data:', error);
    throw error;
  }
}

async function setupDatabase(): Promise<void> {
  try {
    console.log('🔧 Setting up database connection...');
    await createTable();
    console.log('🎉 Database connection setup completed successfully!');
    console.log(`\n📊 You can now use the following API endpoints:`);
    console.log(`GET /api/users/search?name=john`);
    console.log(`POST /api/users/update`);
    console.log(`\n🔑 Don't forget to include the API key in your requests:`);
    console.log(`Header: x-api-key: ${config.server.apiKey}`);
    console.log(`\n📋 The API will connect to existing data in your AWS DynamoDB table.`);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase, createTable };
