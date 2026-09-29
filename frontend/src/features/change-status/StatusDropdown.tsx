import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBookStore, userBookApi, READING_STATUS_OPTIONS } from '@/entities/book';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { BookWithUserInteraction, ReadingStatus } from 'shared-types';
import { Dropdown, DropdownItem } from '@/shared/ui/Dropdown/Dropdown';
import { IconPillButton, PillColorAccent } from '@/shared/ui/IconPillButton/IconPillButton';

interface StatusDropdownProps {
  book: BookWithUserInteraction;
}

export const StatusDropdown = ({ book }: StatusDropdownProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();
  const patchBookInteraction = useBookStore((s) => s.patchBookInteraction);
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const currentStatus = book.userInteraction?.status ?? null;
  const currentConfig = READING_STATUS_OPTIONS.find((s) => s.value === currentStatus);

  const handleSelect = async (status: ReadingStatus | null) => {
    if (!isAuthenticated) {
      openAuthModal();
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    const prevStatus = currentStatus;
    patchBookInteraction(book.olid, { status });

    try {
      await userBookApi.setStatus({
        bookOlid: book.olid,
        status,
        title: book.title,
        authorName: book.authorName,
        coverUrl: book.coverUrl ?? undefined,
      });
    } catch (err) {
      patchBookInteraction(book.olid, { status: prevStatus });
      showToast('error', 'Failed to update status', err instanceof Error ? err.message : undefined);
    }
  };

  const handleTriggerClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsOpen((o) => !o);
  };

  const items: DropdownItem[] = [
    ...READING_STATUS_OPTIONS.map((cfg) => ({
      label: cfg.label,
      dotColor: cfg.colorAccent,
      onClick: () => handleSelect(cfg.value),
      isActive: currentStatus === cfg.value,
    })),
    {
      label: 'Remove from list',
      dotColor: 'neutral',
      onClick: () => handleSelect(null),
      dividerBefore: true,
    },
  ];

  const triggerAccent: PillColorAccent = currentConfig?.colorAccent ?? 'neutral';

  const trigger = (
    <IconPillButton
      aria-label={currentConfig?.label ?? 'Add to reading list'}
      aria-expanded={isOpen}
      onClick={handleTriggerClick}
      colorAccent={triggerAccent}
      icon={<BookOpen size={15} />}
      rightIcon={<ChevronDown size={14} />}
    >
      {currentConfig?.label ?? 'Add to list'}
    </IconPillButton>
  );

  return (
    <Dropdown
      trigger={trigger}
      items={items}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      align="left"
    />
  );
};

