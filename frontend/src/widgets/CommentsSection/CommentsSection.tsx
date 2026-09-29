import { useEffect, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { BookDetails } from 'shared-types';
import { useCommentStore } from '@/entities/comment';
import { AddCommentForm } from '@/features/add-comment';
import { CommentsList } from '@/widgets/CommentsList';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import styles from './CommentsSection.module.scss';

export interface CommentsSectionProps {
  book: BookDetails;
}

export const CommentsSection = ({ book }: CommentsSectionProps) => {
  const pagination = useCommentStore((s) => s.pagination);
  const fetchBookComments = useCommentStore((s) => s.fetchBookComments);
  const reset = useCommentStore((s) => s.reset);
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  const loadComments = useCallback(
    (p: number) => fetchBookComments(book.olid, { page: p, limit }),
    [book.olid, limit, fetchBookComments]
  );

  useEffect(() => {
    reset();
    loadComments(1);
    return () => {
      reset();
    };
  }, [loadComments, reset]);

  const handlePageChange = (p: number) => {
    setPage(p);
    loadComments(p);
  };

  return (
    <section className={styles.section}>
      <PageHeader
        level="h2"
        title="Comments"
        icon={<MessageSquare size={20} />}
        badgeCount={pagination.total}
      />
      <AddCommentForm book={book} />
      <CommentsList
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onRetry={() => loadComments(page)}
      />
    </section>
  );
};
