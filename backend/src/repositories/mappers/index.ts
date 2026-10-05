import type { UserProfile } from 'shared-types';
import type { Comment } from 'shared-types';
import type { UserBookInteraction, ReadingStatus } from 'shared-types';

export const mapToUserProfile = (data: any): UserProfile => ({
  id: data.id,
  username: data.username,
  displayName: data.display_name,
  avatarUrl: data.avatar_url,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const mapToComment = (data: Record<string, any>): Comment => ({
  id: data.id,
  userId: data.user_id,
  bookOlid: data.book_olid,
  content: data.content,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  ...(data.users ? { author: mapToUserProfile(data.users) } : {}),
  ...(data.cached_books
    ? {
        book: {
          olid: data.cached_books.olid,
          title: data.cached_books.title,
          authorName: data.cached_books.author_name,
          coverUrl: data.cached_books.cover_url,
        },
      }
    : {}),
});

export const mapToUserBookInteraction = (data: any): UserBookInteraction => ({
  id: data.id,
  userId: data.user_id,
  bookOlid: data.book_olid,
  isLiked: data.is_liked,
  status: data.status as ReadingStatus | null,
  updatedAt: data.updated_at,
});
