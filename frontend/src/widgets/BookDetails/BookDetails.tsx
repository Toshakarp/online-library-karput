import { BookDetails as BookDetailsType } from 'shared-types';
import { BookCover } from '@/shared/ui/BookCover/BookCover';
import { LikeButton } from '@/features/like-book';
import { StatusDropdown } from '@/features/change-status';
import styles from './BookDetails.module.scss';

interface BookDetailsProps {
  book: BookDetailsType;
}

export const BookDetails = ({ book }: BookDetailsProps) => {
  return (
    <div className={styles.hero}>
      <div className={styles.coverWrap}>
        <BookCover src={book.coverUrl} title={book.title} size="lg" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.author}>{book.authorName}</p>
        {book.description && <p className={styles.description}>{book.description}</p>}
        <div className={styles.actions}>
          <LikeButton book={book} variant="labeled" />
          <StatusDropdown book={book} />
        </div>
      </div>
    </div>
  );
};
