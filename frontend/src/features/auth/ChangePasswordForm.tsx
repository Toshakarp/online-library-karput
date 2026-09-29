import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/entities/user';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import illustration6 from '@/assets/illustration6.svg';
import styles from './ChangePasswordForm.module.scss';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setError('Passwords do not match'); return; }
    if (next.length < 6) { setError('Password must be at least 6 characters'); return; }
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

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <IconButton label={show ? 'Hide' : 'Show'} size="sm" onClick={toggle}>
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </IconButton>
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={illustration6} alt="" className={styles.illustration} />
        <h1 className={styles.title}>Change Password</h1>
        <p className={styles.subtitle}>Keep your account secure with a strong password</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Current password" type={showCurrent ? 'text' : 'password'} value={current}
          onChange={(e) => setCurrent(e.target.value)} rightIcon={eyeBtn(showCurrent, () => setShowCurrent(v => !v))} required />
        <Input label="New password" type={showNext ? 'text' : 'password'} value={next}
          onChange={(e) => setNext(e.target.value)} rightIcon={eyeBtn(showNext, () => setShowNext(v => !v))} required />
        <Input label="Confirm new password" type={showConfirm ? 'text' : 'password'} value={confirm}
          onChange={(e) => setConfirm(e.target.value)} rightIcon={eyeBtn(showConfirm, () => setShowConfirm(v => !v))}
          error={confirm && next !== confirm ? 'Passwords do not match' : undefined} required />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
          <Button type="submit" isLoading={loading}>{loading ? 'Saving…' : 'Change password'}</Button>
        </div>
      </form>
    </div>
  );
};
