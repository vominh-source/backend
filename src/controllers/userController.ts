import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ApiResponse, UpdateUserRequest } from '../types';
import { 
  searchQuerySchema, 
  updateUsersArraySchema 
} from '../validation/schemas';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users/search?name=searchTerm
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = searchQuerySchema.validate(req.query);
      
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Validation error: ${error.details[0].message}`,
        };
        res.status(400).json(response);
        return;
      }

      const { name } = value;
      const users = await this.userService.searchUsers(name);

      const message = name 
        ? `Found ${users.length} users matching "${name}"`
        : `Retrieved ${users.length} users`;

      const response: ApiResponse<typeof users> = {
        success: true,
        data: users,
        message,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching users:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error while searching users',
      };
      res.status(500).json(response);
    }
  };

  // POST /api/users/update
  updateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = updateUsersArraySchema.validate(req.body);
      
      if (error) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Validation error: ${error.details[0].message}`,
        };
        res.status(400).json(response);
        return;
      }

      const updates: UpdateUserRequest[] = value;
      
      try {
        const updatedUsers = await this.userService.updateUsers(updates);

        const response: ApiResponse<typeof updatedUsers> = {
          success: true,
          data: updatedUsers,
          message: `Successfully updated ${updatedUsers.length} users`,
        };

        res.status(200).json(response);
      } catch (serviceError: any) {
        if (serviceError.message.includes('does not exist')) {
          const response: ApiResponse<null> = {
            success: false,
            error: serviceError.message,
          };
          res.status(404).json(response);
          return;
        }
        throw serviceError;
      }
    } catch (error) {
      console.error('Error updating users:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error while updating users',
      };
      res.status(500).json(response);
    }
  };
}
