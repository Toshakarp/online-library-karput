import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useBookStore } from '@/entities/book';
import { SearchBar } from '@/features/search-books';
import { HeroBanner } from '@/widgets/HeroBanner';
import { BookCatalog } from '@/widgets/BookCatalog';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import illustration1 from '@/assets/illustration1.svg';

const HomePage = () => {
  const { books, isLoading, searchBooks, reset } = useBookStore();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  useEffect(() => {
    reset();
    return () => {
      reset();
    };
  }, [reset]);

  const handleSearch = (q: string) => {
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
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    searchBooks({ q: query || undefined, page: p, limit });
  };

  const showInitialWelcome = !hasSearched && books.length === 0 && !isLoading;

  return (
    <>
      <HeroBanner
        title="Explore the world through books"
        subtitle="Discover, track, and discuss your favorite reads"
        illustrationSrc={illustration1}
        illustrationAlt="Reading illustration"
      >
        <SearchBar onSearch={handleSearch} />
      </HeroBanner>

      <PageContainer>
        {showInitialWelcome ? (
          <EmptyState
            icon={<BookOpen size={32} />}
            title="Start searching for books"
            description="Enter a book title, author, or keyword in the search bar above to discover your next read."
          />
        ) : (
          <BookCatalog
            page={page}
            limit={limit}
            skeletonCount={6}
            emptyTitle={`No books found for "${query}"`}
            emptyDescription="Try searching with different keywords or author name."
            onPageChange={handlePageChange}
            onRetry={() => searchBooks({ q: query || undefined, page, limit })}
          />
        )}
      </PageContainer>
    </>
  );
};

export default HomePage;
