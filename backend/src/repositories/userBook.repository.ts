import { supabase } from '@/config/supabase.config.js';
import type { UserBookInteraction, GetUserBooksQueryDto, ReadingStatus, BookWithUserInteraction } from 'shared-types';

const mapToUserBookInteraction = (data: any): UserBookInteraction => ({
  id: data.id,
  userId: data.user_id,
  bookOlid: data.book_olid,
  isLiked: data.is_liked,
  status: data.status as ReadingStatus | null,
  updatedAt: data.updated_at,
});

const mapToBookWithUserInteraction = (data: any): BookWithUserInteraction => ({
  olid: data.cached_books.olid,
  title: data.cached_books.title,
  authorName: data.cached_books.author_name,
  coverUrl: data.cached_books.cover_url,
  likesCount: data.cached_books.likes_count,
  createdAt: data.cached_books.created_at,
  userInteraction: {
    isLiked: data.is_liked,
    status: data.status,
  },
});

export const userBookRepository = {
  async findInteraction(userId: string, bookOlid: string): Promise<UserBookInteraction | null> {
    const { data, error } = await supabase
      .from('user_books')
      .select('id, user_id, book_olid, is_liked, status, updated_at')
      .eq('user_id', userId)
      .eq('book_olid', bookOlid)
      .maybeSingle();

    if (error || !data) return null;
    return mapToUserBookInteraction(data);
  },

  async upsert(userId: string, bookOlid: string, data: { isLiked?: boolean; status?: ReadingStatus | null }): Promise<void> {
    const existing = await this.findInteraction(userId, bookOlid);
    const isLiked = data.isLiked !== undefined ? data.isLiked : (existing ? existing.isLiked : false);
    const status = data.status !== undefined ? data.status : (existing ? existing.status : null);
    
    if (!isLiked && !status) {
      if (existing) {
        await supabase.from('user_books').delete().eq('user_id', userId).eq('book_olid', bookOlid);
      }
      return;
    }

    const updatedData = {
      user_id: userId,
      book_olid: bookOlid,
      updated_at: new Date().toISOString(),
      is_liked: isLiked,
      status: status,
    };

    const { error } = await supabase
      .from('user_books')
      .upsert(updatedData, { onConflict: 'user_id,book_olid' });

    if (error) throw error;
  },

  async findInteractionsByOlids(userId: string, bookOlids: string[]): Promise<Record<string, UserBookInteraction>> {
    if (bookOlids.length === 0) return {};

    const { data, error } = await supabase
      .from('user_books')
      .select('id, user_id, book_olid, is_liked, status, updated_at')
      .eq('user_id', userId)
      .in('book_olid', bookOlids);

    if (error || !data) return {};

    const result: Record<string, UserBookInteraction> = {};
    for (const row of data) {
      result[row.book_olid] = mapToUserBookInteraction(row);
    }
    return result;
  },

  async getUserBooks(userId: string, query: GetUserBooksQueryDto): Promise<{ items: BookWithUserInteraction[]; total: number }> {
    let queryBuilder = supabase
      .from('user_books')
      .select(`is_liked, status, updated_at,
        cached_books!inner (
          olid, title, author_name, cover_url, likes_count, created_at
        )
      `, { count: 'exact' })
      .eq('user_id', userId);

    if (query.category === 'liked') {
      queryBuilder = queryBuilder.eq('is_liked', true);
    } else if (query.category === 'reading_list') {
      queryBuilder = queryBuilder.not('status', 'is', null);
    }

    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.q) {
      queryBuilder = queryBuilder.ilike('cached_books.title', `%${query.q}%`);
    }

    queryBuilder = queryBuilder.order('updated_at', { ascending: false });

    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;
    if (error) throw error;

    const items: BookWithUserInteraction[] = (data || [])
      .filter((row) => row.cached_books)
      .map(mapToBookWithUserInteraction);

    return { items, total: count || 0 };
  }
};