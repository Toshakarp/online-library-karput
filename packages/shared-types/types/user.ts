export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  displayName?: string;
  avatarUrl?: string;
}

export interface ChangeUsernameDto {
  newUsername: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}