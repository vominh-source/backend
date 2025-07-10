export interface User {
  id: number;
  username: string;
  email: string;
  birthdate: string; // ISO date string format
}

export interface CreateUserRequest {
  username: string;
  email: string;
  birthdate: string;
}

export interface UpdateUserRequest {
  id: number;
  username?: string;
  email?: string;
  birthdate?: string;
}

export interface SearchParams {
  name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
