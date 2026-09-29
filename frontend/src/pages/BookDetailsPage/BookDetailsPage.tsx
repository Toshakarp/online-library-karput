import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '@/entities/book';
import { BookDetails } from '@/widgets/BookDetails';
import { CommentsSection } from '@/widgets/CommentsSection';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';

const BookDetailsPage = () => {
  const { olid } = useParams<{ olid: string }>();
  const navigate = useNavigate();
  const { currentBook, isLoading, error, fetchBookByOlid, setCurrentBook } = useBookStore();

  useEffect(() => {
    if (!olid) return;
    fetchBookByOlid(olid);
    return () => {
      setCurrentBook(null);
    };
  }, [olid, fetchBookByOlid, setCurrentBook]);

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
