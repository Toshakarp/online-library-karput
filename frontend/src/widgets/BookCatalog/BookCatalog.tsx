import { memo, useMemo } from 'react';
import { BookWithUserInteraction } from 'shared-types';
import { BookCard, BookCardSkeleton, useBookStore } from '@/entities/book';
import { LikeButton } from '@/features/like-book';
import { StatusDropdown } from '@/features/change-status';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Pagination } from '@/shared/ui/Pagination/Pagination';
import styles from './BookCatalog.module.scss';

export interface BookCatalogProps {
  page: number;
  limit: number;
  skeletonCount?: number;
  emptyTitle: string;
  emptyDescription?: string;
  emptyIllustrationSrc?: string;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

interface CatalogBookItemProps {
  book: BookWithUserInteraction;
}

const CatalogBookItem = memo(({ book }: CatalogBookItemProps) => {
  const actions = useMemo(
    () => (
      <>
        <LikeButton book={book} />
        <StatusDropdown book={book} />
      </>
    ),
    [book]
  );

  return (
    <div className={styles.bookItem}>
      <BookCard book={book} actionSlot={actions} />
    </div>
  );
});

CatalogBookItem.displayName = 'CatalogBookItem';

export const BookCatalog = ({
  page,
  limit,
  skeletonCount = 6,
  emptyTitle,
  emptyDescription,
  emptyIllustrationSrc,
  onPageChange,
  onRetry,
}: BookCatalogProps) => {
  const books = useBookStore((s) => s.books);
  const pagination = useBookStore((s) => s.pagination);
  const isLoading = useBookStore((s) => s.isLoading);
  const error = useBookStore((s) => s.error);

  if (isLoading) {
    return (
      <div className={styles.bookList}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className={styles.bookItem}>
            <BookCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (books.length === 0) {
    return (
      <EmptyState
        illustrationSrc={emptyIllustrationSrc}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      <div className={styles.bookList}>
        {books.map((book) => (
          <CatalogBookItem key={book.olid} book={book} />
        ))}
      </div>
      <Pagination
        page={page}
        total={pagination.total}
        limit={limit}
        onPageChange={onPageChange}
      />
    </>
  );
};
