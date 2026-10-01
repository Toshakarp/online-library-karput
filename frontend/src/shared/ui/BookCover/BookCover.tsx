import { BookOpen } from 'lucide-react';
import styles from './BookCover.module.scss';

export interface BookCoverProps {
  src?: string | null;
  title: string;
  size?: 'xs' | 'sm' | 'lg';
}

const ICON_SIZES: Record<NonNullable<BookCoverProps['size']>, number> = {
  xs: 18,
  sm: 24,
  lg: 48,
};

export const BookCover = ({ src, title, size = 'sm' }: BookCoverProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className={`${styles.cover} ${styles[size]}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${styles.placeholder} ${styles[size]}`}
      aria-label={`No cover for ${title}`}
    >
      <BookOpen size={ICON_SIZES[size]} />
    </div>
  );
};
