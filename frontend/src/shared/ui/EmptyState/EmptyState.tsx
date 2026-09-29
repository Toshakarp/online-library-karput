import type { ReactNode } from 'react';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  icon?: ReactNode;
  illustrationSrc?: string;
  title: string;
  description?: string;
  actionSlot?: ReactNode;
  compact?: boolean;
}

export const EmptyState = ({
  icon,
  illustrationSrc,
  title,
  description,
  actionSlot,
  compact = false,
}: EmptyStateProps) => (
  <div className={[styles.container, compact ? styles.compact : ''].filter(Boolean).join(' ')}>
    {illustrationSrc && (
      <img src={illustrationSrc} alt="" className={styles.illustration} />
    )}
    {icon && <div className={styles.iconBadge}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {actionSlot && <div className={styles.actions}>{actionSlot}</div>}
  </div>
);
