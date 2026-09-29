import { Heart } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBookStore, userBookApi } from '@/entities/book';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { BookWithUserInteraction } from 'shared-types';
import { IconPillButton } from '@/shared/ui/IconPillButton/IconPillButton';

interface LikeButtonProps {
  book: BookWithUserInteraction;
  variant?: 'icon' | 'labeled';
}

export const LikeButton = ({ book, variant = 'icon' }: LikeButtonProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();
  const patchBookInteraction = useBookStore((s) => s.patchBookInteraction);
  const { showToast } = useToast();

  const isLiked = book.userInteraction?.isLiked ?? false;

  const handleClick = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const nextLiked = !isLiked;
    const prevLiked = isLiked;

    patchBookInteraction(book.olid, {
      isLiked: nextLiked,
      likesCountDelta: nextLiked ? 1 : -1,
    });

    try {
      await userBookApi.setLike({
        bookOlid: book.olid,
        liked: nextLiked,
        title: book.title,
        authorName: book.authorName,
        coverUrl: book.coverUrl ?? undefined,
      });
    } catch (err) {
      patchBookInteraction(book.olid, {
        isLiked: prevLiked,
        likesCountDelta: nextLiked ? -1 : 1,
      });
      showToast('error', 'Failed to update like', err instanceof Error ? err.message : undefined);
    }
  };

  const labelText =
    variant === 'labeled'
      ? `${isLiked ? 'Liked' : 'Like'} (${book.likesCount})`
      : book.likesCount;

  return (
    <IconPillButton
      aria-label={isLiked ? 'Unlike book' : 'Like book'}
      onClick={handleClick}
      colorAccent={isLiked ? 'danger' : 'neutral'}
      icon={<Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />}
    >
      {labelText}
    </IconPillButton>
  );
};

