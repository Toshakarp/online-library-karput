import { apiClient } from '@/shared/api/apiClient';
import {
  BookWithUserInteraction,
  GetUserBooksQueryDto,
  PaginatedResponse,
  SetLikeDto,
  SetReadingStatusDto,
} from 'shared-types';

export const userBookApi = {
  setLike(dto: SetLikeDto) {
    return apiClient.post<null>('/user-books/like', dto);
  },

  setStatus(dto: SetReadingStatusDto) {
    return apiClient.post<null>('/user-books/status', dto);
  },

  getUserBooks(query: GetUserBooksQueryDto) {
    return apiClient.get<PaginatedResponse<BookWithUserInteraction>>('/user-books', {
      q: query.q || undefined,
      category: query.category,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  },
};
