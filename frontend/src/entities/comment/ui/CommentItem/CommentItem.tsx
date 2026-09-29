import type { ReactNode } from 'react';
import { Comment } from 'shared-types';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import styles from './CommentItem.module.scss';

export interface CommentItemProps {
  comment: Comment;
  actionsSlot?: ReactNode;
  editSlot?: ReactNode;
  onClick?: () => void;
}

export const CommentItem = ({
  comment,
  actionsSlot,
  editSlot,
  onClick,
}: CommentItemProps) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const authorName = comment.author?.displayName || comment.author?.username || 'User';

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div
          className={[styles.authorRow, onClick ? styles.clickable : ''].filter(Boolean).join(' ')}
          onClick={onClick}
        >
          <Avatar
            src={comment.author?.avatarUrl ?? undefined}
            name={authorName}
            size="sm"
          />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{authorName}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        </div>
        {actionsSlot && (
          <div className={styles.actionsSlot} onClick={(e) => e.stopPropagation()}>
            {actionsSlot}
          </div>
        )}
      </div>

      {editSlot ? (
        <div onClick={(e) => e.stopPropagation()}>{editSlot}</div>
      ) : (
        <p
          className={[styles.content, onClick ? styles.clickable : ''].filter(Boolean).join(' ')}
          onClick={onClick}
        >
          {comment.content}
        </p>
      )}
    </div>
  );
};

