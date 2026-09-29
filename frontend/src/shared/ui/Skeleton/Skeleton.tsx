import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'title' | 'rect';
  className?: string;
}

export const Skeleton = ({
  width,
  height,
  variant = 'rect',
  className,
}: SkeletonProps) => {
  const variantClass = variant !== 'rect' ? styles[variant] : '';

  return (
    <span
      className={[styles.skeleton, variantClass, className ?? ''].filter(Boolean).join(' ')}
      style={width !== undefined || height !== undefined ? { width, height } : undefined}
    />
  );
};
