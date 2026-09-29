import type { ReactNode } from 'react';
import styles from './HeroBanner.module.scss';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
  children?: ReactNode;
}

export const HeroBanner = ({
  title,
  subtitle,
  illustrationSrc,
  illustrationAlt = '',
  children,
}: HeroBannerProps) => (
  <section className={styles.hero}>
    <div className={styles.content}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
    {illustrationSrc && (
      <div className={styles.illustration}>
        <img src={illustrationSrc} alt={illustrationAlt} />
      </div>
    )}
  </section>
);
