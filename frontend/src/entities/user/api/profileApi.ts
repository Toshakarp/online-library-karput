import { apiClient } from '@/shared/api/apiClient';
import { ChangeUsernameDto, UpdateUserProfileDto, UserProfile } from 'shared-types';

export const profileApi = {
  getMe() {
    return apiClient.get<UserProfile>('/profile/me');
  },

  updateMe(dto: UpdateUserProfileDto) {
    return apiClient.patch<UserProfile>('/profile/me', dto);
  },

  updateUsername(dto: ChangeUsernameDto) {
    return apiClient.patch<UserProfile>('/profile/me/username', dto);
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<{ avatarUrl: string }>('/profile/me/avatar', formData);
  },
};
