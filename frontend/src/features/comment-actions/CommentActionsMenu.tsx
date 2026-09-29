import { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { commentApi, useCommentStore } from '@/entities/comment';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { Comment } from 'shared-types';
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown';
import { IconButton } from '@/shared/ui/IconButton/IconButton';

interface CommentActionsMenuProps {
  comment: Comment;
  onEditStart: () => void;
}

export const CommentActionsMenu = ({
  comment,
  onEditStart,
}: CommentActionsMenuProps) => {
  const user = useAuthStore((s) => s.user);
  const removeComment = useCommentStore((s) => s.removeComment);
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || user.id !== comment.userId) return null;

  const handleDelete = async () => {
    setIsOpen(false);
    try {
      await commentApi.delete(comment.id);
      removeComment(comment.id);
      showToast('success', 'Comment deleted');
    } catch (err) {
      showToast('error', 'Failed to delete comment', err instanceof Error ? err.message : undefined);
    }
  };

  const items = [
    {
      label: 'Edit',
      icon: <Edit2 size={14} />,
      onClick: () => { setIsOpen(false); onEditStart(); },
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: handleDelete,
      danger: true,
      dividerBefore: true,
    },
  ];

  return (
    <Dropdown
      trigger={
        <IconButton label="Comment options" size="sm" onClick={() => setIsOpen((o) => !o)}>
          <MoreHorizontal size={16} />
        </IconButton>
      }
      items={items}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
};
