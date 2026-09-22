import { supabase } from '@/config/supabase.config.js';
import type { CachedBook } from 'shared-types';

export const bookRepository = {
  async findByOlid(olid: string): Promise<CachedBook | null> {
    const { data, error } = await supabase
      .from('cached_books')
      .select('olid, title, author_name, cover_url, likes_count, created_at')
      .eq('olid', olid)
      .single();
    if (error || !data) return null;
    return {
      olid: data.olid,
      title: data.title,
      authorName: data.author_name,
      coverUrl: data.cover_url,
      likesCount: data.likes_count,
      createdAt: data.created_at
    };
  },

  async upsert(book: Omit<CachedBook, 'likesCount' | 'createdAt'>): Promise<void> {
    const { error } = await supabase
      .from('cached_books')
      .upsert({
        olid: book.olid,
        title: book.title,
        author_name: book.authorName,
        cover_url: book.coverUrl
      }, { onConflict: 'olid' });
    if (error) throw error;
  },

  async updateLikesCount(olid: string, delta: 1 | -1): Promise<void> {
    const { data: book } = await supabase.from('cached_books').select('likes_count').eq('olid', olid).single();
    if (book) {
      const newCount = Math.max(0, book.likes_count + delta);
      await supabase.from('cached_books').update({ likes_count: newCount }).eq('olid', olid);
    }
  }
};