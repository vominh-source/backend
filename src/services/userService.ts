import { docClient } from '../config/database';
import { config } from '../config';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';

export class UserService {
  private tableName = config.dynamodb.tableName;
  private static nextId = 1;

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Get next ID (in a real app, you'd use an atomic counter in DynamoDB)
    const id = UserService.nextId++;
    
    const user: User = {
      id,
      ...userData,
    };

    const params = {
      TableName: this.tableName,
      Item: user,
    };

    await docClient.put(params).promise();
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const result = await docClient.get(params).promise();
    return result.Item as User || null;
  }

  async searchUsers(searchTerm?: string): Promise<User[]> {
    let params: any = {
      TableName: this.tableName,
    };

    // If searchTerm is provided, add filter expression
    if (searchTerm) {
      params.FilterExpression = 'contains(#username, :searchTerm) OR contains(#email, :searchTerm)';
      params.ExpressionAttributeNames = {
        '#username': 'username',
        '#email': 'email',
      };
      params.ExpressionAttributeValues = {
        ':searchTerm': searchTerm.toLowerCase(),
      };
    }

    const result = await docClient.scan(params).promise();
    return (result.Items as User[]) || [];
  }

  async updateUsers(updates: UpdateUserRequest[]): Promise<User[]> {
    const updatedUsers: User[] = [];

    for (const update of updates) {
      // First, check if user exists
      const existingUser = await this.getUserById(update.id);
      if (!existingUser) {
        throw new Error(`User with id ${update.id} does not exist`);
      }

      // Prepare update expression
      const updateExpressions: string[] = [];
      const expressionAttributeNames: { [key: string]: string } = {};
      const expressionAttributeValues: { [key: string]: any } = {};

      if (update.username !== undefined) {
        updateExpressions.push('#username = :username');
        expressionAttributeNames['#username'] = 'username';
        expressionAttributeValues[':username'] = update.username;
      }

      if (update.email !== undefined) {
        updateExpressions.push('#email = :email');
        expressionAttributeNames['#email'] = 'email';
        expressionAttributeValues[':email'] = update.email;
      }

      if (update.birthdate !== undefined) {
        updateExpressions.push('#birthdate = :birthdate');
        expressionAttributeNames['#birthdate'] = 'birthdate';
        expressionAttributeValues[':birthdate'] = update.birthdate;
      }

      if (updateExpressions.length === 0) {
        // No updates to make, return existing user
        updatedUsers.push(existingUser);
        continue;
      }

      const params = {
        TableName: this.tableName,
        Key: { id: update.id },
        UpdateExpression: 'SET ' + updateExpressions.join(', '),
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW' as const,
      };

      const result = await docClient.update(params).promise();
      updatedUsers.push(result.Attributes as User);
    }

    return updatedUsers;
  }
}
