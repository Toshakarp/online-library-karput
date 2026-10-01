import { useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useBookStore } from '@/entities/book';
import { BookDetails } from '@/widgets/BookDetails';
import { CommentsSection } from '@/widgets/CommentsSection';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { ROUTES } from '@/shared/config/routes';

const BookDetailsPage = () => {
  const { olid } = useParams<{ olid: string }>();
  const navigate = useNavigate();
  const currentBook = useBookStore((s) => s.currentBook);
  const isLoading = useBookStore((s) => s.isLoading);
  const error = useBookStore((s) => s.error);
  const fetchBookByOlid = useBookStore((s) => s.fetchBookByOlid);
  const setCurrentBook = useBookStore((s) => s.setCurrentBook);

  useEffect(() => {
    if (!olid) return;
    fetchBookByOlid(olid);
    return () => {
      setCurrentBook(null);
    };
  }, [olid, fetchBookByOlid, setCurrentBook]);

  if (!isLoading && error === 'NOT_FOUND') {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return (
    <PageContainer>
      <PageHeader onBack={() => navigate(-1)} />
      {isLoading && <Spinner centered />}
      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => olid && fetchBookByOlid(olid)} />
      )}
      {!isLoading && !error && currentBook && (
        <>
          <BookDetails book={currentBook} />
          <CommentsSection book={currentBook} />
        </>
      )}
    </PageContainer>
  );
};

export default BookDetailsPage;
