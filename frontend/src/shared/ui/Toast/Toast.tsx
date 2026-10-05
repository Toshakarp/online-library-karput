import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { ToastItem, ToastType } from '@/shared/lib/toast/ToastContext';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import styles from './Toast.module.scss';

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
};

export interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const Toast = ({ toasts, onDismiss }: ToastProps) =>
  createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={[styles.toast, styles[toast.type]].join(' ')}>
          <span className={[styles.icon, styles[`icon_${toast.type}`]].join(' ')}>
            {ICONS[toast.type]}
          </span>
          <div className={styles.content}>
            <div className={styles.title}>{toast.title}</div>
            {toast.message && <div className={styles.message}>{toast.message}</div>}
          </div>
          <IconButton
            label="Dismiss"
            size="sm"
            className={styles.closeBtn}
            onClick={() => onDismiss(toast.id)}
          >
            <X size={14} />
          </IconButton>
        </div>
      ))}
    </div>,
    document.body,
  );
