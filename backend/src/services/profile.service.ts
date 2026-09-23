import { userRepository } from '@/repositories/user.repository.js';
import { storageRepository } from '@/repositories/storage.repository.js';
import type { UpdateUserProfileDto, UserProfile } from 'shared-types';

export const profileService = {
  async getMe(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const { password_hash, ...profile } = user;
    return profile;
  },

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserProfile> {
    return await userRepository.updateProfile(userId, dto);
  },

  async updateUsername(userId: string, dto: { newUsername: string }): Promise<UserProfile> {
    return await userRepository.updateUsername(userId, dto.newUsername);
  },

  async uploadAvatar(userId: string, file: { buffer: Buffer; mimetype: string }): Promise<{ avatarUrl: string }> {
    
    const ext = file.mimetype.split('/')[1] || 'jpg';
    const filePath = `${userId}.${ext}`;

    const avatarUrl = await storageRepository.uploadAvatar(filePath, file.buffer, file.mimetype);
    await userRepository.updateProfile(userId, { avatarUrl });

    return { avatarUrl };
  }
};