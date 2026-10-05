import { useEffect, useState, useCallback } from 'react';
import { useBookStore } from '@/entities/book';
import { usePagination } from '@/shared/lib/hooks/usePagination';

export const useHomePage = () => {
  const books = useBookStore((s) => s.books);
  const isLoading = useBookStore((s) => s.isLoading);
  const searchBooks = useBookStore((s) => s.searchBooks);
  const reset = useBookStore((s) => s.reset);

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  useEffect(() => {
    reset();
    return () => {
      reset();
    };
  }, [reset]);

  const handleSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      setQuery(trimmed);
      setPage(1);
      if (!trimmed) {
        setHasSearched(false);
        reset();
        return;
      }
      setHasSearched(true);
      searchBooks({ q: trimmed, page: 1, limit });
    },
    [limit, reset, searchBooks, setPage],
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      searchBooks({ q: query || undefined, page: p, limit });
    },
    [limit, query, searchBooks, setPage],
  );

  const handleRetry = useCallback(() => {
    if (query) {
      searchBooks({ q: query, page, limit });
    }
  }, [limit, page, query, searchBooks]);

  const showInitialWelcome = !hasSearched && books.length === 0 && !isLoading;

  return {
    page,
    limit,
    query,
    showInitialWelcome,
    handleSearch,
    handlePageChange,
    handleRetry,
  };
};
