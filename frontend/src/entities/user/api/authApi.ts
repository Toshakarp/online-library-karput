import { apiClient } from '@/shared/api/apiClient';
import { AuthResponse, ChangePasswordDto, LoginDto, RegisterDto } from 'shared-types';

export const authApi = {
  register(dto: RegisterDto) {
    return apiClient.post<AuthResponse>('/auth/register', dto);
  },

  login(dto: LoginDto) {
    return apiClient.post<AuthResponse>('/auth/login', dto);
  },

  changePassword(dto: ChangePasswordDto) {
    return apiClient.patch<null>('/auth/change-password', dto);
  },
};
