import type { ReactNode } from 'react';
import styles from './PageContainer.module.scss';

export interface PageContainerProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const PageContainer = ({ size = 'lg', children }: PageContainerProps) => (
  <div className={[styles.container, styles[size]].join(' ')}>{children}</div>
);
