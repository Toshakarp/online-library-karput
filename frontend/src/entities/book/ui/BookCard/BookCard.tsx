import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookWithUserInteraction } from 'shared-types';
import { ROUTES } from '@/shared/config/routes';
import { BookCover } from '@/shared/ui/BookCover/BookCover';
import styles from './BookCard.module.scss';

interface BookCardProps {
  book: BookWithUserInteraction;
  actionSlot?: ReactNode;
}

export const BookCard = ({ book, actionSlot }: BookCardProps) => {
  const detailsUrl = ROUTES.BOOK_PATH(book.olid);

  return (
    <article className={styles.card}>
      <Link to={detailsUrl} className={styles.coverLink} aria-label={book.title}>
        <BookCover src={book.coverUrl} title={book.title} size="sm" />
      </Link>

      <div className={styles.body}>
        <Link to={detailsUrl} className={styles.infoLink}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.authorName}</p>
        </Link>

        {actionSlot && (
          <div className={styles.actions}>
            {actionSlot}
          </div>
        )}
      </div>
    </article>
  );
};

