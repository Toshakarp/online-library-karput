import { supabase } from '@/config/supabase.config.js';

export const storageRepository = {
  async uploadAvatar(filePath: string, buffer: Buffer, mimeType: string): Promise<string> {
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, { contentType: mimeType, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async deleteAvatar(userId: string): Promise<void> {

    const { data } = await supabase.storage.from('avatars').list('', { search: userId });
    if (data && data.length > 0) {
      const filesToRemove = data.filter(f => f.name.startsWith(userId)).map(f => f.name);
      if (filesToRemove.length > 0) {
        await supabase.storage.from('avatars').remove(filesToRemove);
      }
    }
  }
};