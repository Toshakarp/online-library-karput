import { UserProfile } from './user';

export interface Comment {
  id: string;
  userId: string;
  bookOlid: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: UserProfile;
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