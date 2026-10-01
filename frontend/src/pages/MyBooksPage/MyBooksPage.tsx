import { useEffect, useState, useCallback } from 'react';
import { useBookStore } from '@/entities/book';
import { SearchBar } from '@/features/search-books';
import { BookFilters, type FilterState } from '@/features/filter-books';
import { BookCatalog } from '@/widgets/BookCatalog';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useQueryParams } from '@/shared/lib/hooks/useQueryParams';
import illustration4 from '@/assets/illustration4.svg';

const MyBooksPage = () => {
  const { get: getQueryParam, set: setQueryParam } = useQueryParams();
  const { pagination, fetchUserBooks, reset } = useBookStore();
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

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
    loadBooks(q, 1, filters);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    const cat = newFilters.category && newFilters.category !== 'all' ? newFilters.category : null;
    setQueryParam('category', cat);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    loadBooks(query, p, filters);
  };

  return (
    <PageContainer>
      <PageHeader title="My Books" badgeCount={pagination.total} />
      <SearchBar onSearch={handleSearch} placeholder="Search your books..." />
      <BookFilters filters={filters} onChange={handleFiltersChange} />
      <BookCatalog
        page={page}
        limit={limit}
        skeletonCount={4}
        emptyIllustrationSrc={illustration4}
        emptyTitle="No books here yet"
        emptyDescription="Start exploring and add books to your library"
        onPageChange={handlePageChange}
        onRetry={() => loadBooks(query, page, filters)}
      />
    </PageContainer>
  );
};

export default MyBooksPage;
