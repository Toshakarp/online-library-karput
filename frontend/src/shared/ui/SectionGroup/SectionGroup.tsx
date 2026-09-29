import type { ReactNode } from 'react';
import styles from './SectionGroup.module.scss';

export interface SectionGroupProps {
  title: string;
  children: ReactNode;
}

export const SectionGroup = ({ title, children }: SectionGroupProps) => (
  <section className={styles.section}>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.items}>{children}</div>
  </section>
);
