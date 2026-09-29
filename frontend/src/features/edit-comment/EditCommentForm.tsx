import { useState, type FormEvent } from 'react';
import { Comment } from 'shared-types';
import { commentApi, useCommentStore } from '@/entities/comment';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Button } from '@/shared/ui/Button/Button';
import styles from './EditCommentForm.module.scss';

export interface EditCommentFormProps {
  comment: Comment;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditCommentForm = ({
  comment,
  onCancel,
  onSuccess,
}: EditCommentFormProps) => {
  const [content, setContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const patchComment = useCommentStore((s) => s.patchComment);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      const updated = await commentApi.update(comment.id, { content: trimmed });
      patchComment(comment.id, updated.content, updated.updatedAt);
      showToast('success', 'Comment updated');
      onSuccess?.();
    } catch (err) {
      showToast(
        'error',
        'Failed to update comment',
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.editArea} onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        autoFocus
      />
      <div className={styles.editActions}>
        <Button
          type="submit"
          size="sm"
          isLoading={saving}
          disabled={!content.trim()}
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
};
