import { env } from '@/config/env.config.js';
import { rateLimiterUtil } from '@/utils/rateLimiter.util.js';
import { NotFoundError, BadGatewayError } from '@/errors/app.errors.js';
import type { CachedBook, BookDetails } from 'shared-types';

const fetchOpenLibraryJson = async (url: string, notFoundMessage?: string): Promise<any> => {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new BadGatewayError('OpenLibrary service unavailable');
  }

  if (res.status === 404 && notFoundMessage) {
    throw new NotFoundError(notFoundMessage);
  }

  if (!res.ok) {
    throw new BadGatewayError('OpenLibrary API error');
  }

  const data = await res.json();
  if (notFoundMessage && (data?.error === 'not found' || !data?.title)) {
    throw new NotFoundError(notFoundMessage);
  }

  return data;
};

export const openLibraryRepository = {
  async searchBooks(
    query: string,
    page: number,
    limit: number,
  ): Promise<{ items: CachedBook[]; total: number }> {
    const fetchTask = async () => {
      const data = await fetchOpenLibraryJson(
        `${env.OPEN_LIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );

      const items: CachedBook[] = (data.docs || [])
        .map((doc: any) => ({
          olid: doc.key?.startsWith('/works/') ? doc.key.replace('/works/', '') : '',
          title: doc.title,
          authorName: doc.author_name?.[0] || 'Unknown Author',
          coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
          likesCount: 0,
          createdAt: new Date().toISOString(),
        }))
        .filter((book: CachedBook) => Boolean(book.olid));

      return { items, total: data.numFound || 0 };
    };

    return await rateLimiterUtil.enqueue(fetchTask);
  },

  async getBookByOlid(olid: string): Promise<BookDetails> {
    const fetchTask = async () => {
      const data = await fetchOpenLibraryJson(
        `${env.OPEN_LIBRARY_BASE_URL}/works/${encodeURIComponent(olid)}.json`,
        'Book not found',
      );

      let description = '';
      if (typeof data.description === 'string') description = data.description;
      else if (data.description?.value) description = data.description.value;

      let authorName = 'Unknown Author';
      if (data.authors?.[0]?.author?.key) {
        try {
          const authorRes = await fetch(
            `${env.OPEN_LIBRARY_BASE_URL}${data.authors[0].author.key}.json`,
          );
          if (authorRes.ok) {
            const authorData: any = await authorRes.json();
            authorName = authorData.name || authorName;
          }
        } catch {}
      }

      const book: BookDetails = {
        olid,
        title: data.title,
        authorName,
        coverUrl: data.covers?.[0]
          ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
          : null,
        likesCount: 0,
        createdAt: new Date().toISOString(),
        description,
      };
      return book;
    };

    return await rateLimiterUtil.enqueue(fetchTask);
  },
};
