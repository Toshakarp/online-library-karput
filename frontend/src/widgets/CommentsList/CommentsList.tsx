import { useState } from 'react';
import { Comment } from 'shared-types';
import { CommentItem, useCommentStore } from '@/entities/comment';
import { CommentActionsMenu } from '@/features/comment-actions';
import { EditCommentForm } from '@/features/edit-comment';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { Pagination } from '@/shared/ui/Pagination/Pagination';
import styles from './CommentsList.module.scss';

export interface CommentsListProps {
  page: number;
  limit: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIllustrationSrc?: string;
  onCommentClick?: (comment: Comment) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export const CommentsList = ({
  page,
  limit,
  emptyTitle = 'No comments yet',
  emptyDescription = 'Be the first to share your thoughts!',
  emptyIllustrationSrc,
  onCommentClick,
  onPageChange,
  onRetry,
}: CommentsListProps) => {
  const comments = useCommentStore((s) => s.comments);
  const pagination = useCommentStore((s) => s.pagination);
  const isLoading = useCommentStore((s) => s.isLoading);
  const error = useCommentStore((s) => s.error);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return <Spinner centered />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <>
      {comments.length === 0 ? (
        <EmptyState
          illustrationSrc={emptyIllustrationSrc}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className={styles.list}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onClick={onCommentClick ? () => onCommentClick(comment) : undefined}
              editSlot={
                editingId === comment.id ? (
                  <EditCommentForm
                    comment={comment}
                    onCancel={() => setEditingId(null)}
                    onSuccess={() => setEditingId(null)}
                  />
                ) : undefined
              }
              actionsSlot={
                <CommentActionsMenu
                  comment={comment}
                  onEditStart={() => setEditingId(comment.id)}
                />
              }
            />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        total={pagination.total}
        limit={limit}
        onPageChange={onPageChange}
      />
    </>
  );
};
