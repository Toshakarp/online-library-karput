import { apiClient } from '@/shared/api/apiClient';
import {
  Comment,
  CreateCommentDto,
  PaginatedResponse,
  PaginationQueryDto,
  UpdateCommentDto,
} from 'shared-types';

export const commentApi = {
  getByBook(olid: string, params?: PaginationQueryDto) {
    return apiClient.get<PaginatedResponse<Comment>>(`/comments/book/${olid}`, {
      page: params?.page,
      limit: params?.limit,
    });
  },

  getByUser(params?: PaginationQueryDto) {
    return apiClient.get<PaginatedResponse<Comment>>('/comments/user', {
      page: params?.page,
      limit: params?.limit,
    });
  },

  create(dto: CreateCommentDto) {
    return apiClient.post<Comment>('/comments', dto);
  },

  update(id: string, dto: UpdateCommentDto) {
    return apiClient.patch<Comment>(`/comments/${id}`, dto);
  },

  delete(id: string) {
    return apiClient.delete<null>(`/comments/${id}`);
  },
};
