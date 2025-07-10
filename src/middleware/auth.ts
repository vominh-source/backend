import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { ApiResponse } from '../types';

export interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
}

export const apiKeyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'API key is required. Please provide x-api-key header.',
    };
    res.status(401).json(response);
    return;
  }

  if (apiKey !== config.server.apiKey) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid API key.',
    };
    res.status(401).json(response);
    return;
  }

  req.isAuthenticated = true;
  next();
};
