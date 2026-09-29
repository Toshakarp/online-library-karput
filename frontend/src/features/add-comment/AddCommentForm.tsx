import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { commentApi, useCommentStore } from '@/entities/comment';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { BookDetails } from 'shared-types';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Button } from '@/shared/ui/Button/Button';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import styles from './AddCommentForm.module.scss';

interface AddCommentFormProps {
  book: BookDetails;
}

export const AddCommentForm = ({ book }: AddCommentFormProps) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();
  const addComment = useCommentStore((s) => s.addComment);
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const created = await commentApi.create({
        bookOlid: book.olid,
        content: content.trim(),
        title: book.title,
        authorName: book.authorName,
        coverUrl: book.coverUrl ?? undefined,
      });
      addComment({ ...created, author: user });
      setContent('');
      showToast('success', 'Comment added');
    } catch (err) {
      showToast('error', 'Failed to add comment', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts about this book..."
        rows={3}
      />
      <div className={styles.footer}>
        <Button type="submit" size="sm" isLoading={loading} disabled={!content.trim()}>
          {loading ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  );
};
