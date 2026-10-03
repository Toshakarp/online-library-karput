import { SearchBar } from '@/features/search-books';
import { BookFilters } from '@/features/filter-books';
import { BookCatalog } from '@/widgets/BookCatalog';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import illustration4 from '@/assets/illustration4.svg';
import { useMyBooksPage } from './model/useMyBooksPage';

export const MyBooksPage = () => {
  const {
    total,
    page,
    limit,
    filters,
    handleSearch,
    handleFiltersChange,
    handlePageChange,
    handleRetry,
  } = useMyBooksPage();

  return (
    <PageContainer>
      <PageHeader title="My Books" badgeCount={total} />
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
        onRetry={handleRetry}
      />
    </PageContainer>
  );
};

export default MyBooksPage;