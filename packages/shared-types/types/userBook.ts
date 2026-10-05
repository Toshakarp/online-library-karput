import type { ReadingStatus } from './status';
import type { PaginationQueryDto } from './api';

export interface SetLikeDto {
  bookOlid: string;
  liked: boolean;
  title: string;
  authorName: string;
  coverUrl?: string;
}

export interface SetReadingStatusDto {
  bookOlid: string;
  status: ReadingStatus | null;
  title: string;
  authorName: string;
  coverUrl?: string;
}

export interface UserBookInteraction {
  id: string;
  userId: string;
  bookOlid: string;
  isLiked: boolean;
  status: ReadingStatus | null;
  updatedAt: string;
}

export interface GetUserBooksQueryDto extends PaginationQueryDto {
  q?: string;
  category?: 'liked' | 'reading_list' | 'all';
  status?: ReadingStatus;
  sort?: 'alpha_asc' | 'alpha_desc';
}
