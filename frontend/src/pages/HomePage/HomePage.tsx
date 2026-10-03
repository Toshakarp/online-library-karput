import { BookOpen } from 'lucide-react';
import { SearchBar } from '@/features/search-books';
import { HeroBanner } from '@/widgets/HeroBanner';
import { BookCatalog } from '@/widgets/BookCatalog';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import illustration1 from '@/assets/illustration1.svg';
import { useHomePage } from './model/useHomePage';

export const HomePage = () => {
  const {
    page,
    limit,
    query,
    showInitialWelcome,
    handleSearch,
    handlePageChange,
    handleRetry,
  } = useHomePage();

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
            emptyTitle={`No books found for "${query}"`}
            emptyDescription="Try searching with different keywords or author name."
            onPageChange={handlePageChange}
            onRetry={handleRetry}
          />
        )}
      </PageContainer>
    </>
  );
};

export default HomePage;