import { useState, useCallback, useMemo, memo } from 'react';
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

interface CommentsListItemProps {
  comment: Comment;
  isEditing: boolean;
  onEditStart: (id: string) => void;
  onEditEnd: () => void;
  onCommentClick?: (comment: Comment) => void;
}

const CommentsListItem = memo(({
  comment,
  isEditing,
  onEditStart,
  onEditEnd,
  onCommentClick,
}: CommentsListItemProps) => {
  
  const handleClick = useCallback(() => {
    onCommentClick?.(comment);
  }, [onCommentClick, comment]);

  const handleEditStart = useCallback(() => {
    onEditStart(comment.id);
  }, [onEditStart, comment.id]);

  const actionsSlot = useMemo(
    () => (
      <CommentActionsMenu
        comment={comment}
        onEditStart={handleEditStart}
      />
    ),
    [comment, handleEditStart]
  );

  const editSlot = useMemo(
    () =>
      isEditing ? (
        <EditCommentForm
          comment={comment}
          onCancel={onEditEnd}
          onSuccess={onEditEnd}
        />
      ) : undefined,
    [isEditing, comment, onEditEnd]
  );

  return (
    <CommentItem
      comment={comment}
      onClick={onCommentClick ? handleClick : undefined}
      editSlot={editSlot}
      actionsSlot={actionsSlot}
    />
  );
});

CommentsListItem.displayName = 'CommentsListItem';

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

  const handleEditStart = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleEditEnd = useCallback(() => {
    setEditingId(null);
  }, []);

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
            <CommentsListItem
              key={comment.id}
              comment={comment}
              isEditing={editingId === comment.id}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onCommentClick={onCommentClick}
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