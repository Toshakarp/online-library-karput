import type { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.scss';

type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
  label: string;
}

export const IconButton = ({
  size = 'md',
  label,
  children,
  className,
  type = 'button',
  ...props
}: IconButtonProps) => {
  const classes = [styles.iconButton, styles.ghost, styles[size], className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={styles.wrapper} aria-label={label} {...props}>
      <span className={classes}>{children}</span>
    </button>
  );
};
