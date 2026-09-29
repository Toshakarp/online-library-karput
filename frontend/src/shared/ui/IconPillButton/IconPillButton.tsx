import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconPillButton.module.scss';

export type PillColorAccent = 'neutral' | 'danger' | 'yellow' | 'purple' | 'green';
export type PillSize = 'sm' | 'md';

export interface IconPillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  rightIcon?: ReactNode;
  colorAccent?: PillColorAccent;
  size?: PillSize;
  children?: ReactNode;
}

export const IconPillButton = ({
  icon,
  rightIcon,
  colorAccent = 'neutral',
  size = 'md',
  children,
  className,
  type = 'button',
  ...props
}: IconPillButtonProps) => {
  const accentClass = styles[`accent${colorAccent.charAt(0).toUpperCase() + colorAccent.slice(1)}`];
  const classes = [
    styles.pillButton,
    styles[size],
    accentClass,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      <span className={styles.icon}>{icon}</span>
      {children !== undefined && children !== null && (
        <span className={styles.label}>{children}</span>
      )}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};
