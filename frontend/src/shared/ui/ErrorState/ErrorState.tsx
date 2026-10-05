import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) => (
  <div className={styles.container}>
    <AlertCircle size={40} className={styles.icon} />
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.message}>{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
