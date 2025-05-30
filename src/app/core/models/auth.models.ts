export interface UserSignupRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserDto {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // Add other user properties as needed based on your backend UserDto
}

export interface UserSignupResponse {
  success: boolean;
  message?: string;
  user?: UserDto;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: UserDto;
  // Add other response fields as needed based on your backend response
} 