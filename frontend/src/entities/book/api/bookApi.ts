import { apiClient } from '@/shared/api/apiClient';
import {
  BookDetails,
  BookWithUserInteraction,
  PaginatedResponse,
} from 'shared-types';

export interface SearchBooksParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const bookApi = {
  search(params: SearchBooksParams) {
    return apiClient.get<PaginatedResponse<BookWithUserInteraction>>('/books/search', {
      q: params.q || undefined,
      page: params.page,
      limit: params.limit,
    });
  },

  getByOlid(olid: string) {
    return apiClient.get<BookDetails>(`/books/${olid}`);
  },
};
