import { userRepository } from '@/repositories/user.repository.js';
import { storageService } from './storage.service.js';
import { NotFoundError } from '@/errors/app.errors.js';
import type { UpdateUserProfileDto, UserProfile } from 'shared-types';

export const profileService = {
  async getMe(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const { password_hash, ...profile } = user;
    return profile;
  },

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserProfile> {
    if (dto.avatarUrl === null) {
      try {
        await storageService.deleteAvatar(userId);
      } catch (err) {
        console.error('Error updating profile')
      }
    }
    return await userRepository.updateProfile(userId, dto);
  },

  async updateUsername(userId: string, dto: { newUsername: string }): Promise<UserProfile> {
    return await userRepository.updateUsername(userId, dto.newUsername);
  },

  async uploadAvatar(userId: string, file: Express.Multer.File | { buffer: Buffer; mimetype: string }): Promise<{ avatarUrl: string }> {
    const avatarUrl = await storageService.uploadAvatar(userId, file.buffer, file.mimetype);
    await userRepository.updateProfile(userId, { avatarUrl });
    return { avatarUrl };
  }
};