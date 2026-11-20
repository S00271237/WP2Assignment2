export type UserRole = 'user' | 'admin';

// what the API returns for a user
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// what the API returns after a successful login
export interface AuthResponse {
  token: string;
  user: User;
}