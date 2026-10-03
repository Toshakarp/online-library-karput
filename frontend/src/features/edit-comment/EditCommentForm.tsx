import { memo } from 'react';
import { Comment } from 'shared-types';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Button } from '@/shared/ui/Button/Button';
import { useEditCommentForm } from './model/useEditCommentForm';
import styles from './EditCommentForm.module.scss';

export interface EditCommentFormProps {
  comment: Comment;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditCommentForm = memo(({
  comment,
  onCancel,
  onSuccess,
}: EditCommentFormProps) => {
  
  const {
    textareaRef,
    hasText,
    saving,
    handleChange,
    handleSubmit,
  } = useEditCommentForm({ comment, onSuccess });

  return (
    <form className={styles.editArea} onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        defaultValue={comment.content}
        onChange={handleChange}
        rows={3}
        autoFocus
      />
      <div className={styles.editActions}>
        <Button
          type="submit"
          size="sm"
          isLoading={saving}
          disabled={!hasText}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
});

EditCommentForm.displayName = 'EditCommentForm';