import { env } from '@/config/env.config.js';
import { rateLimiterUtil } from '@/utils/rateLimiter.util.js';
import type { CachedBook, BookDetails } from 'shared-types';

export const openLibraryRepository = {
  async searchBooks(
    query: string,
    page: number,
    limit: number,
  ): Promise<{ items: CachedBook[]; total: number }> {
    const fetchTask = async () => {
      const res = await fetch(
        `${env.OPEN_LIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      if (!res.ok) throw new Error('OpenLibrary API error');
      const data = await res.json();

      const items: CachedBook[] = (data.docs || [])
        .map((doc: any) => ({
          olid: doc.key?.replace('/works/', '') || doc.cover_edition_key,
          title: doc.title,
          authorName: doc.author_name?.[0] || 'Unknown Author',
          coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
          likesCount: 0,
          createdAt: new Date().toISOString(),
        }))
        .filter((book: CachedBook) => book.olid);

      return { items, total: data.numFound || 0 };
    };

    return await rateLimiterUtil.enqueue(fetchTask);
  },

  async getBookByOlid(olid: string): Promise<BookDetails> {
    const fetchTask = async () => {
      const res = await fetch(`${env.OPEN_LIBRARY_BASE_URL}/works/${olid}.json`);
      if (!res.ok) throw new Error('OpenLibrary API error');
      const data = await res.json();

      let description = '';
      if (typeof data.description === 'string') description = data.description;
      else if (data.description?.value) description = data.description.value;

      let authorName = 'Unknown Author';
      if (data.authors?.[0]?.author?.key) {
        const authorRes = await fetch(
          `${env.OPEN_LIBRARY_BASE_URL}${data.authors[0].author.key}.json`,
        );
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          authorName = authorData.name;
        }
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
