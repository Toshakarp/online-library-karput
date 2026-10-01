import { supabase } from '@/config/supabase.config.js';
import { mapToUserProfile } from './mappers/index.js';
import type { CreateCommentDto, Comment } from 'shared-types';
import { mapToComment } from './mappers/index.js';

const COMMENT_USER_SELECT = '*, users (id, username, display_name, avatar_url, created_at, updated_at)';
const COMMENT_BOOK_SELECT = '*, cached_books (olid, title, author_name, cover_url)';


export const commentRepository = {
  async create(userId: string, dto: CreateCommentDto): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({ user_id: userId, book_olid: dto.bookOlid, content: dto.content })
      .select(COMMENT_USER_SELECT)
      .single();
    if (error) throw error;
    return mapToComment(data);
  },

  async findByBookOlid(olid: string, page: number, limit: number): Promise<{ items: Comment[], total: number }> {
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('comments')
      .select(COMMENT_USER_SELECT, { count: 'exact' })
      .eq('book_olid', olid)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    const items: Comment[] = (data || []).map(mapToComment);
    return { items, total: count || 0 };
  },

  async findByUserId(userId: string, page: number, limit: number): Promise<{ items: Comment[], total: number }> {
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('comments')
      .select(COMMENT_BOOK_SELECT, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    const items: Comment[] = (data || []).map(mapToComment);
    return { items, total: count || 0 };
  },

  async update(id: string, userId: string, content: string): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select(COMMENT_USER_SELECT)
      .maybeSingle();

    if (error) throw error;
    return data ? mapToComment(data) : null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async findOwnerId(id: string): Promise<string | null> {
    const { data, error } = await supabase.from('comments').select('user_id').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return data.user_id;
  }
};
