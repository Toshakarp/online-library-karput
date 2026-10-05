import { memo } from 'react';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Button } from '@/shared/ui/Button/Button';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { useAddCommentForm } from './model/useAddCommentForm';
import styles from './AddCommentForm.module.scss';

interface AddCommentFormProps {
  bookOlid: string;
}

export const AddCommentForm = memo(({ bookOlid }: AddCommentFormProps) => {
  const {
    isAuthenticated,
    openAuthModal,
    textareaRef,
    hasText,
    loading,
    handleChange,
    handleSubmit,
  } = useAddCommentForm({ bookOlid });

  if (!isAuthenticated) {
    return (
      <EmptyState
        compact
        title="Want to share your thoughts?"
        actionSlot={
          <Button size="sm" onClick={openAuthModal}>
            Sign in to comment
          </Button>
        }
      />
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        onChange={handleChange}
        placeholder="Write a comment..."
        rows={3}
      />
      <div className={styles.actions}>
        <Button type="submit" size="sm" isLoading={loading} disabled={!hasText}>
          {loading ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  );
});

AddCommentForm.displayName = 'AddCommentForm';
