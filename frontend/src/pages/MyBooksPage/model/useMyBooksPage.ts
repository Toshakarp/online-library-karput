import { useEffect, useState, useCallback } from 'react';
import { useBookStore } from '@/entities/book';
import { type FilterState } from '@/features/filter-books';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useQueryParams } from '@/shared/lib/hooks/useQueryParams';

export const useMyBooksPage = () => {
  const { get: getQueryParam, set: setQueryParam } = useQueryParams();
  
  const total = useBookStore((s) => s.pagination.total);
  const fetchUserBooks = useBookStore((s) => s.fetchUserBooks);
  const reset = useBookStore((s) => s.reset);

  const [query, setQuery] = useState('');
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  const [filters, setFilters] = useState<FilterState>({
    category: (getQueryParam('category') as FilterState['category']) || 'all',
  });

  const loadBooks = useCallback(
    (q: string, p: number, f: FilterState) =>
      fetchUserBooks({
        q: q || undefined,
        category: f.category,
        status: f.status,
        page: p,
        limit,
      }),
    [limit, fetchUserBooks]
  );

  useEffect(() => {
    loadBooks(query, 1, filters);
    return () => {
      reset();
    };
  }, [filters, loadBooks, reset]);

  const urlCategory = (getQueryParam('category') as FilterState['category']) || 'all';

  useEffect(() => {
    if (urlCategory !== filters.category) {
      setFilters((f) => ({ ...f, category: urlCategory }));
      setPage(1);
    }
  }, [urlCategory, filters.category, setPage]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setPage(1);
    loadBooks(q, 1, filters);
  }, [filters, loadBooks, setPage]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    const cat = newFilters.category && newFilters.category !== 'all' ? newFilters.category : null;
    setQueryParam('category', cat);
  }, [setPage, setQueryParam]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    loadBooks(query, p, filters);
  }, [filters, loadBooks, query, setPage]);

  const handleRetry = useCallback(() => {
    loadBooks(query, page, filters);
  }, [filters, loadBooks, page, query]);

  return {
    total,
    page,
    limit,
    filters,
    handleSearch,
    handleFiltersChange,
    handlePageChange,
    handleRetry,
  };
};