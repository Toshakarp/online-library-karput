import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import styles from './BookCard.module.scss';

export const BookCardSkeleton = () => (
  <article className={styles.card}>
    <Skeleton className={styles.skeletonCover} />
    <div className={styles.body}>
      <div className={styles.infoLink}>
        <Skeleton variant="title" width="80%" />
        <Skeleton variant="text" width="55%" />
      </div>
      <div className={styles.actions}>
        <Skeleton width={80} height={36} className={styles.skeletonPill} />
        <Skeleton width={120} height={36} className={styles.skeletonPill} />
      </div>
    </div>
  </article>
);
