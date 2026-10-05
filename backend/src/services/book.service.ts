import { openLibraryService } from './openLibrary.service.js';
import { userBookRepository } from '@/repositories/userBook.repository.js';
import { bookRepository } from '@/repositories/book.repository.js';
import type {
  PaginatedResponse,
  BookWithUserInteraction,
  BookDetails,
  UserBookInteraction,
} from 'shared-types';

export const bookService = {
  async ensureBookExists(dto: {
    bookOlid: string;
    title: string;
    authorName: string;
    coverUrl?: string;
  }): Promise<void> {
    await bookRepository.upsert({
      olid: dto.bookOlid,
      title: dto.title,
      authorName: dto.authorName,
      coverUrl: dto.coverUrl || null,
    });
  },

  async searchBooks(
    query: string,
    userId: string | undefined,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<BookWithUserInteraction>> {
    const { items, total } = await openLibraryService.searchBooks(query, page, limit);
    if (items.length === 0) {
      return { items: [], total, page, limit };
    }

    const olids = items.map((b) => b.olid);

    const [likesMap, interactionsMap] = await Promise.all([
      bookRepository.findLikesCountByOlids(olids),
      userId
        ? userBookRepository.findInteractionsByOlids(userId, olids)
        : Promise.resolve<Record<string, UserBookInteraction>>({}),
    ]);

    const enrichedItems: BookWithUserInteraction[] = items.map((book) => {
      const interaction = interactionsMap[book.olid];
      const likesCount = likesMap[book.olid] ?? 0;
      return {
        ...book,
        likesCount,
        ...(interaction
          ? {
              userInteraction: {
                isLiked: interaction.isLiked,
                status: interaction.status,
              },
            }
          : {}),
      };
    });

    return { items: enrichedItems, total, page, limit };
  },

  async getBookByOlid(olid: string, userId: string | undefined): Promise<BookDetails> {
    const [bookDetails, cachedBook, interaction] = await Promise.all([
      openLibraryService.getBookDetails(olid),
      bookRepository.findByOlid(olid),
      userId ? userBookRepository.findInteraction(userId, olid) : Promise.resolve(null),
    ]);

    return {
      ...bookDetails,
      likesCount: cachedBook?.likesCount ?? bookDetails.likesCount ?? 0,
      ...(interaction
        ? {
            userInteraction: {
              isLiked: interaction.isLiked,
              status: interaction.status,
            },
          }
        : {}),
    };
  },
};
