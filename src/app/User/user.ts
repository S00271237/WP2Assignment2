export type UserRole = 'user' | 'admin';

// what the API returns for a user
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// what the login form sends
export interface LoginRequest {
  email: string;
  password: string;
}

// what the register form sends
export interface RegisterRequest {
  email: string;
  password: string;
}

// what the API returns after a successful login
export interface AuthResponse {
  token: string;
  user: User;
}