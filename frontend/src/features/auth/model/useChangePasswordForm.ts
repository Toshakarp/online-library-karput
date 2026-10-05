import { useState, type FormEvent } from 'react';
import { authApi } from '@/entities/user';
import { useToast } from '@/shared/lib/toast/ToastContext';

interface UseChangePasswordFormOptions {
  onSuccess?: () => void;
}

export const useChangePasswordForm = ({ onSuccess }: UseChangePasswordFormOptions) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const current = (formData.get('currentPassword') as string) ?? '';
    const next = (formData.get('newPassword') as string) ?? '';
    const confirm = (formData.get('confirmPassword') as string) ?? '';

    if (next !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (next.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: current,
        newPassword: next,
      });
      showToast('success', 'Password changed successfully');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
  };
};
