import type { ReadingStatus } from './status';

export interface CachedBook {
  olid: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  likesCount: number;
  createdAt: string;
}

export interface BookWithUserInteraction extends CachedBook {
  userInteraction?: {
    isLiked: boolean;
    status: ReadingStatus | null;
  };
}

export interface BookDetails extends BookWithUserInteraction {
  description?: string;
}
