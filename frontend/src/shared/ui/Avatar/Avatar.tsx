import styles from './Avatar.module.scss';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const Avatar = ({
  src,
  alt = '',
  name,
  size = 'md',
  className,
}: AvatarProps) => {
  const classes = [styles.avatar, styles[size], className ?? ''].filter(Boolean).join(' ');

  if (src) {
    return (
      <div className={classes}>
        <img src={src} alt={alt} className={styles.img} />
      </div>
    );
  }

  return (
    <div className={classes} aria-label={alt || name}>
      {name ? getInitials(name) : '?'}
    </div>
  );
};
