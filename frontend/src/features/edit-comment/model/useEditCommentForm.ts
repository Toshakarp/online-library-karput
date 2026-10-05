import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Comment } from 'shared-types';
import { commentApi, useCommentStore } from '@/entities/comment';
import { useToast } from '@/shared/lib/toast/ToastContext';

interface UseEditCommentFormOptions {
  comment: Comment;
  onSuccess?: () => void;
}

export const useEditCommentForm = ({ comment, onSuccess }: UseEditCommentFormOptions) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasText, setHasText] = useState(Boolean(comment.content.trim()));
  const [saving, setSaving] = useState(false);

  const patchComment = useCommentStore((s) => s.patchComment);
  const { showToast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const isFilled = e.target.value.trim().length > 0;
    if (isFilled !== hasText) {
      setHasText(isFilled);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = textareaRef.current?.value.trim() ?? '';
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
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    textareaRef,
    hasText,
    saving,
    handleChange,
    handleSubmit,
  };
};
