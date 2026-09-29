import { useState, type FormEvent } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { authApi } from '@/entities/user';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { useToast } from '@/shared/lib/toast/ToastContext';
import styles from './AuthForm.module.scss';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const dto = { username: username.trim(), password };
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

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}><BookOpen size={24} /></div>
      </div>
      <h2 className={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      <p className={styles.subtitle}>
        {mode === 'login' ? 'Sign in to your library' : 'Start exploring books'}
      </p>

      <form onSubmit={handleSubmit} className={styles.fields}>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          autoComplete="username"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" isLoading={loading} fullWidth>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className={styles.switch}>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className={styles.switchLink}
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
        >
          {mode === 'login' ? 'Register' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};

