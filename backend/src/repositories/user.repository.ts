import { supabase } from '@/config/supabase.config.js';
import type { UserProfile, UpdateUserProfileDto } from 'shared-types';
import { NotFoundError, ConflictError } from '@/errors/app.errors.js';
import { mapToUserProfile } from './mappers/index.js';

export const userRepository = {
  async findById(id: string): Promise<(UserProfile & { password_hash: string }) | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, created_at, updated_at, password_hash')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return {
      ...mapToUserProfile(data),
      password_hash: data.password_hash,
    };
  },

  async findByUsername(
    username: string,
  ): Promise<(UserProfile & { password_hash: string }) | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, created_at, updated_at, password_hash')
      .eq('username', username)
      .maybeSingle();
    if (error || !data) return null;
    return {
      ...mapToUserProfile(data),
      password_hash: data.password_hash,
    };
  },

  async create(dto: { username: string; passwordHash: string }): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: dto.username,
        password_hash: dto.passwordHash,
        display_name: dto.username,
      })
      .select('id, username, display_name, avatar_url, created_at, updated_at')
      .single();
    if (error) {
      if (error.code === '23505') throw new ConflictError('Username already taken');
      throw error;
    }
    return mapToUserProfile(data);
  },

  async updateProfile(id: string, dto: UpdateUserProfileDto): Promise<UserProfile> {
    const updateData: any = { updated_at: new Date().toISOString() };
    if (dto.displayName !== undefined) updateData.display_name = dto.displayName;
    if (dto.avatarUrl !== undefined) updateData.avatar_url = dto.avatarUrl;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, username, display_name, avatar_url, created_at, updated_at')
      .single();
    if (error || !data) throw new NotFoundError('User not found');
    return mapToUserProfile(data);
  },

  async updateUsername(id: string, username: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, username, display_name, avatar_url, created_at, updated_at')
      .single();
    if (error) {
      if (error.code === '23505') throw new ConflictError('Username already taken');
      throw error;
    }
    if (!data) throw new NotFoundError('User not found');
    return mapToUserProfile(data);
  },

  async updatePasswordHash(id: string, hash: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ password_hash: hash, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
