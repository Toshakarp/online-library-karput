import { storageRepository } from '@/repositories/storage.repository.js';

export const storageService = {
  async uploadAvatar(userId: string, buffer: Buffer, mimeType: string): Promise<string> {
    const ext = mimeType.split('/')[1] || 'jpg';
    const filePath = `${userId}.${ext}`;

    return await storageRepository.uploadAvatar(filePath, buffer, mimeType);
  },

  async deleteAvatar(userId: string): Promise<void> {
    await storageRepository.deleteAvatar(userId);
  }
};