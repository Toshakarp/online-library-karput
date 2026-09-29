import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  level?: 'h1' | 'h2';
  icon?: ReactNode;
  badgeCount?: number;
  onBack?: () => void;
  actionsSlot?: ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  level = 'h1',
  icon,
  badgeCount,
  onBack,
  actionsSlot,
}: PageHeaderProps) => {
  const HeadingTag = level;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {onBack && (
          <IconButton label="Go back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
        )}
        {icon && <span className={styles.icon}>{icon}</span>}
        {title && (
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <HeadingTag className={level === 'h1' ? styles.h1 : styles.h2}>
                {title}
              </HeadingTag>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span className={styles.badge}>{badgeCount}</span>
              )}
            </div>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
      </div>
      {actionsSlot && <div className={styles.actions}>{actionsSlot}</div>}
    </div>
  );
};
