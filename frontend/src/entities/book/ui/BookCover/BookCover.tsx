import { BookOpen } from 'lucide-react';
import styles from './BookCover.module.scss';

export interface BookCoverProps {
  src?: string | null;
  title: string;
  size?: 'sm' | 'lg';
  className?: string;
}

export const BookCover = ({
  src,
  title,
  size = 'sm',
  className,
}: BookCoverProps) => {
  const iconSize = size === 'lg' ? 48 : 28;

  if (src) {
    return (
      <img
        src={src}
        alt={`Cover of ${title}`}
        className={[styles.cover, styles[size], className ?? ''].filter(Boolean).join(' ')}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={[styles.placeholder, styles[size], className ?? ''].filter(Boolean).join(' ')}
      aria-label={`No cover for ${title}`}
    >
      <BookOpen size={iconSize} />
    </div>
  );
};
