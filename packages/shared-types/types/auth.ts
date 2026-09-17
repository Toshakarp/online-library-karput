import { UserProfile } from './user';

export interface RegisterDto {
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}