import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className={styles.container} aria-label="Pagination">
      <IconButton
        label="Previous page"
        size="md"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft size={16} />
      </IconButton>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={p}
            className={[styles.btn, page === p ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onPageChange(p)}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <IconButton
        label="Next page"
        size="md"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight size={16} />
      </IconButton>
    </nav>
  );
};
