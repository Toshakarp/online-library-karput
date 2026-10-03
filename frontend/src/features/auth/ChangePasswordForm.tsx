import { useState, memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import illustration6 from '@/assets/illustration6.svg';
import { useChangePasswordForm } from './model/useChangePasswordForm';
import styles from './ChangePasswordForm.module.scss';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PasswordFieldProps {
  name: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
}

const ChangePasswordHeader = memo(() => (
  <div className={styles.header}>
    <img src={illustration6} alt="" className={styles.illustration} />
    <h1 className={styles.title}>Change Password</h1>
    <p className={styles.subtitle}>Keep your account secure with a strong password</p>
  </div>
));

ChangePasswordHeader.displayName = 'ChangePasswordHeader';

const PasswordField = memo(({ name, label, autoComplete, required = true }: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <Input
      name={name}
      label={label}
      type={show ? 'text' : 'password'}
      autoComplete={autoComplete}
      required={required}
      rightIcon={
        <IconButton
          label={show ? 'Hide password' : 'Show password'}
          size="sm"
          type="button"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </IconButton>
      }
    />
  );
});

PasswordField.displayName = 'PasswordField';

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const { loading, error, handleSubmit } = useChangePasswordForm({ onSuccess });

  return (
    <div className={styles.card}>
      <ChangePasswordHeader />
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordField
          name="currentPassword"
          label="Current password"
          autoComplete="current-password"
        />
        <PasswordField
          name="newPassword"
          label="New password"
          autoComplete="new-password"
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={loading}>
            {loading ? 'Saving…' : 'Change password'}
          </Button>
        </div>
      </form>
    </div>
  );
};