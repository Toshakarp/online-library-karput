import type { UserProfile } from './user';
import type { CachedBook } from './book';

export type CommentBookInfo = Pick<CachedBook, 'olid' | 'title' | 'authorName' | 'coverUrl'>;

export interface Comment {
  id: string;
  userId: string;
  bookOlid: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: UserProfile | undefined;
  book?: CommentBookInfo | undefined;
}

export interface CreateCommentDto {
  bookOlid: string;
  content: string;
  title: string;
  authorName: string;
  coverUrl?: string;
}

export interface UpdateCommentDto {
  content: string;
}
