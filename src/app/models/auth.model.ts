export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  role: string;
  message: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
}
