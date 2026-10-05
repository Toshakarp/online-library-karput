import { userBookRepository } from '@/repositories/userBook.repository.js';
import { bookService } from './book.service.js';
import { bookRepository } from '@/repositories/book.repository.js';
import type {
  SetLikeDto,
  SetReadingStatusDto,
  GetUserBooksQueryDto,
  PaginatedResponse,
  BookWithUserInteraction,
} from 'shared-types';

export const userBookService = {
  async setLike(userId: string, dto: SetLikeDto): Promise<void> {
    await bookService.ensureBookExists(dto);

    const existing = await userBookRepository.findInteraction(userId, dto.bookOlid);

    if (existing?.isLiked === dto.liked) {
      return;
    }

    await userBookRepository.upsert(userId, dto.bookOlid, { isLiked: dto.liked });
    await bookRepository.updateLikesCount(dto.bookOlid, dto.liked ? 1 : -1);
  },

  async setStatus(userId: string, dto: SetReadingStatusDto): Promise<void> {
    await bookService.ensureBookExists(dto);
    await userBookRepository.upsert(userId, dto.bookOlid, { status: dto.status });
  },

  async getUserBooks(
    userId: string,
    query: GetUserBooksQueryDto,
  ): Promise<PaginatedResponse<BookWithUserInteraction>> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const { items, total } = await userBookRepository.getUserBooks(userId, {
      ...query,
      page,
      limit,
    });

    return { items, total, page, limit };
  },
};
