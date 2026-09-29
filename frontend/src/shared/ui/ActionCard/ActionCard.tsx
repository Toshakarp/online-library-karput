import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './ActionCard.module.scss';

export type IconBg = 'brand' | 'purple' | 'danger' | 'neutral';

export interface ActionCardProps {
  icon: ReactNode;
  iconBg?: IconBg;
  title: string;
  description?: string;
  onClick?: () => void;
}

export const ActionCard = ({
  icon,
  iconBg = 'neutral',
  title,
  description,
  onClick,
}: ActionCardProps) => {
  const iconBgClass = styles[`iconBg${iconBg.charAt(0).toUpperCase() + iconBg.slice(1)}`];

  return (
    <button type="button" className={styles.actionCard} onClick={onClick}>
      <div className={[styles.iconWrap, iconBgClass].join(' ')}>
        {icon}
      </div>
      <div className={styles.actionInfo}>
        <span className={styles.actionTitle}>{title}</span>
        {description && <span className={styles.actionDesc}>{description}</span>}
      </div>
      <ChevronRight size={18} className={styles.actionArrow} />
    </button>
  );
};
