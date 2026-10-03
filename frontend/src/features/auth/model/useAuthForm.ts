import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { authApi } from '@/entities/user';
import { useToast } from '@/shared/lib/toast/ToastContext';

interface UseAuthFormOptions {
  onSuccess?: () => void;
}

export const useAuthForm = ({ onSuccess }: UseAuthFormOptions) => {
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string)?.trim() ?? '';
    const password = (formData.get('password') as string)?.trim() ?? '';

    if (!username || !password) return;

    setError(null);
    setLoading(true);

    try {
      const dto = { username, password };
      const res = mode === 'login' ? await authApi.login(dto) : await authApi.register(dto);
      login(res.user, res.token);
      showToast('success', mode === 'login' ? 'Welcome back!' : 'Account created!');
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    loading,
    error,
    toggleMode,
    handleSubmit,
  };
};