import { useEffect, useCallback, memo } from 'react';
import { MessageSquare } from 'lucide-react';
import { useCommentStore } from '@/entities/comment';
import { AddCommentForm } from '@/features/add-comment';
import { CommentsList } from '@/widgets/CommentsList';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import styles from './CommentsSection.module.scss';

export interface CommentsSectionProps {
  bookOlid: string;
}

export const CommentsSection = memo(({ bookOlid }: CommentsSectionProps) => {
  const pagination = useCommentStore((s) => s.pagination);
  const fetchBookComments = useCommentStore((s) => s.fetchBookComments);
  const reset = useCommentStore((s) => s.reset);
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  const loadComments = useCallback(
    (p: number) => fetchBookComments(bookOlid, { page: p, limit }),
    [bookOlid, limit, fetchBookComments]
  );

  useEffect(() => {
    reset();
    loadComments(1);
    return () => {
      reset();
    };
  }, [loadComments, reset]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    loadComments(p);
  }, [loadComments, setPage]);

  const handleRetry = useCallback(() => {
    loadComments(page);
  }, [loadComments, page]);

  return (
    <section className={styles.section}>
      <PageHeader
        level="h2"
        title="Comments"
        icon={<MessageSquare size={20} />}
        badgeCount={pagination.total}
      />
      <AddCommentForm bookOlid={bookOlid} />
      <CommentsList
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
      />
    </section>
  );
});

CommentsSection.displayName = 'CommentsSection';
