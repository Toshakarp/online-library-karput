import { cacheUtil } from '@/utils/cache.util.js';
import { openLibraryRepository } from '@/repositories/openLibrary.repository.js';
import { DomainError, BadGatewayError } from '@/errors/app.errors.js';
import type { CachedBook, BookDetails } from 'shared-types';

export const openLibraryService = {
  async searchBooks(
    query: string,
    page: number,
    limit: number,
  ): Promise<{ items: CachedBook[]; total: number }> {
    const cacheKey = `search:${query}:${page}:${limit}`;

    const cached = cacheUtil.get<{ items: CachedBook[]; total: number }>(cacheKey);
    if (cached) return cached;

    try {
      const result = await openLibraryRepository.searchBooks(query, page, limit);
      cacheUtil.set(cacheKey, result, 1800);
      return result;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new BadGatewayError('Failed to fetch search results from Open Library');
    }
  },

  async getBookDetails(olid: string): Promise<BookDetails> {
    const cacheKey = `book:${olid}`;

    const cached = cacheUtil.get<BookDetails>(cacheKey);
    if (cached) return cached;

    try {
      const result = await openLibraryRepository.getBookByOlid(olid);
      cacheUtil.set(cacheKey, result, 1800);
      return result;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new BadGatewayError('Failed to fetch book details from Open Library');
    }
  },
};
