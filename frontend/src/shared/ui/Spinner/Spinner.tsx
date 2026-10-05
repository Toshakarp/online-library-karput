import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  centered?: boolean;
}

export const Spinner = ({ size = 'md', color = 'primary', centered = false }: SpinnerProps) => {
  const inner = (
    <span className={[styles.spinner, styles[size], styles[color]].join(' ')}>
      <span className={styles.ring} />
    </span>
  );

  if (centered) {
    return <div className={styles.centered}>{inner}</div>;
  }

  return inner;
};
