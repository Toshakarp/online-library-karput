import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBookStore } from '@/entities/book';
import { commentApi, useCommentStore } from '@/entities/comment';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';

interface UseAddCommentFormOptions {
  bookOlid: string;
}

export const useAddCommentForm = ({ bookOlid }: UseAddCommentFormOptions) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();
  const addComment = useCommentStore((s) => s.addComment);
  const { showToast } = useToast();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasText, setHasText] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const isFilled = e.target.value.trim().length > 0;
    if (isFilled !== hasText) {
      setHasText(isFilled);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const content = textareaRef.current?.value.trim() ?? '';
    if (!content) return;

    const user = useAuthStore.getState().user;
    if (!user) return;

    const currentBook = useBookStore.getState().currentBook;

    setLoading(true);
    try {
      const created = await commentApi.create({
        bookOlid,
        content,
        title: currentBook?.title || '',
        authorName: currentBook?.authorName || '',
        coverUrl: currentBook?.coverUrl ?? undefined,
      });
      addComment(created.author ? created : { ...created, author: user });
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
      setHasText(false);
      showToast('success', 'Comment added');
    } catch (err) {
      showToast('error', 'Failed to add comment', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    openAuthModal,
    textareaRef,
    hasText,
    loading,
    handleChange,
    handleSubmit,
  };
};