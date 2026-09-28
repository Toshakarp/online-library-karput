import type { ApiResponse } from 'shared-types';

export const apiResponseFactory = {
  success<T>(data?: T): ApiResponse<T> {
    return { success: true, data };
  },
  error<T>(code: string, message: string): ApiResponse<T> {
    return { success: false, error: { code, message } };
  }
};