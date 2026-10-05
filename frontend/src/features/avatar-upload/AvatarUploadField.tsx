import { useRef, useState, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { profileApi } from '@/entities/user';
import { useToast } from '@/shared/lib/toast/ToastContext';
import styles from './AvatarUploadField.module.scss';

interface AvatarUploadFieldProps {
  currentAvatarUrl: string | null;
  name: string;
  onUploaded: (url: string) => void;
}

export const AvatarUploadField = ({
  currentAvatarUrl,
  name,
  onUploaded,
}: AvatarUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Invalid file', 'Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const result = await profileApi.uploadAvatar(file);
      setLocalPreview(result.avatarUrl);
      onUploaded(result.avatarUrl);
      showToast('success', 'Avatar updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      showToast('error', 'Upload failed', message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const displayUrl = localPreview ?? currentAvatarUrl;

  return (
    <div className={styles.wrapper} onClick={() => inputRef.current?.click()}>
      <Avatar src={displayUrl} name={name} size="lg" />
      <div
        className={[styles.overlay, uploading ? styles.overlayVisible : '']
          .filter(Boolean)
          .join(' ')}
      >
        {uploading ? <Spinner size="sm" color="white" /> : <Camera size={20} />}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={handleFileChange}
        aria-label="Upload avatar"
      />
    </div>
  );
};
