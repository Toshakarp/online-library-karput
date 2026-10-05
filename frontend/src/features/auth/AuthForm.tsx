import { BookOpen } from 'lucide-react';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { useAuthForm } from './model/useAuthForm';
import styles from './AuthForm.module.scss';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { mode, loading, error, toggleMode, handleSubmit } = useAuthForm({ onSuccess });

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <BookOpen size={24} />
        </div>
      </div>
      <h2 className={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      <p className={styles.subtitle}>
        {mode === 'login' ? 'Sign in to your library' : 'Start exploring books'}
      </p>

      <form onSubmit={handleSubmit} className={styles.fields}>
        <Input
          name="username"
          label="Username"
          placeholder="your_username"
          autoComplete="username"
          required
        />
        <Input
          name="password"
          label="Password"
          type="password"
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
        <button type="button" className={styles.switchLink} onClick={toggleMode}>
          {mode === 'login' ? 'Register' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};
