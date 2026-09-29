import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { setApiErrorHandler } from '@/shared/api/apiClient';
import { ToastContext, type ToastItem, type ToastType } from '@/shared/lib/toast/ToastContext';
import { Toast } from '@/shared/ui/Toast/Toast';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  useEffect(() => {
    setApiErrorHandler((errMessage: string) => {
      showToast('error', 'Server Error', errMessage);
    });
    return () => setApiErrorHandler(null);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};
