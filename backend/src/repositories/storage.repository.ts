import { supabase } from '@/config/supabase.config.js';

export const storageRepository = {
  async uploadAvatar(filePath: string, buffer: Buffer, mimeType: string): Promise<string> {
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, { contentType: mimeType, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  }
};