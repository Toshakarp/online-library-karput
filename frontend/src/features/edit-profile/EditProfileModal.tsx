import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { AvatarUploadField } from '@/features/avatar-upload';
import { useAuthStore } from '@/app/store/useAuthStore';
import { profileApi } from '@/entities/user';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { UserProfile } from 'shared-types';
import styles from './EditProfileModal.module.scss';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  displayName: string;
  newUsername: string;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { showToast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      displayName: user?.displayName ?? '',
      newUsername: user?.username ?? '',
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      setAvatarUrl(user.avatarUrl);
      reset({
        displayName: user.displayName,
        newUsername: user.username,
      });
    }
  }, [isOpen, user, reset]);

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      let updatedUser: UserProfile = { ...user, avatarUrl };

      if (values.displayName !== user.displayName) {
        updatedUser = await profileApi.updateMe({ displayName: values.displayName });
        updateProfile({ ...updatedUser });
      }

      if (values.newUsername !== user.username) {
        updatedUser = await profileApi.updateUsername({ newUsername: values.newUsername });
        updateProfile({ ...updatedUser });
      }

      if (avatarUrl !== user.avatarUrl) {
        updateProfile({ avatarUrl });
      }

      showToast('success', 'Profile updated');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      showToast('error', 'Error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button form="edit-profile-form" type="submit" isLoading={saving}>Save changes</Button>
        </>
      }
    >
      <form id="edit-profile-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatarSection}>
          <AvatarUploadField
            currentAvatarUrl={avatarUrl}
            name={user.displayName || user.username}
            onUploaded={(url) => {
              setAvatarUrl(url);
              updateProfile({ avatarUrl: url });
            }}
          />
          <div className={styles.avatarInfo}>
            <span className={styles.avatarLabel}>Profile photo</span>
            <span className={styles.avatarHint}>Click to upload a new photo</span>
          </div>
        </div>

        <Input
          label="Display name"
          error={errors.displayName?.message}
          {...register('displayName', {
            maxLength: { value: 50, message: 'Max 50 characters' },
          })}
        />

        <Input
          label="Username"
          error={errors.newUsername?.message}
          {...register('newUsername', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            maxLength: { value: 30, message: 'Max 30 characters' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Letters, numbers, underscores only',
            },
          })}
        />
      </form>
    </Modal>
  );
};
