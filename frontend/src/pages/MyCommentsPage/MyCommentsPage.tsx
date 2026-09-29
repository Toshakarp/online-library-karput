import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommentStore } from '@/entities/comment';
import { CommentsList } from '@/widgets/CommentsList';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { ROUTES } from '@/shared/config/routes';
import illustration5 from '@/assets/illustration5.svg';

const MyCommentsPage = () => {
  const navigate = useNavigate();
  const pagination = useCommentStore((s) => s.pagination);
  const fetchUserComments = useCommentStore((s) => s.fetchUserComments);
  const reset = useCommentStore((s) => s.reset);
  const { page, limit, setPage } = usePagination({ initialPage: 1, initialLimit: 10 });

  const loadComments = useCallback(
    (p: number) => fetchUserComments({ page: p, limit }),
    [limit, fetchUserComments]
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
    <PageContainer size="md">
      <PageHeader title="My Comments" badgeCount={pagination.total} />
      <CommentsList
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onRetry={() => loadComments(page)}
        onCommentClick={(comment) => navigate(ROUTES.BOOK_PATH(comment.bookOlid))}
        emptyIllustrationSrc={illustration5}
        emptyTitle="No comments yet"
        emptyDescription="Start reading books and share your thoughts"
      />
    </PageContainer>
  );
};

export default MyCommentsPage;
