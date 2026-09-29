import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { ReadingStatus } from 'shared-types';
import { READING_STATUS_OPTIONS } from '@/entities/book';
import { Dropdown, DropdownItem } from '@/shared/ui/Dropdown/Dropdown';
import { IconPillButton, PillColorAccent } from '@/shared/ui/IconPillButton/IconPillButton';
import styles from './BookFilters.module.scss';

export interface FilterState {
  category: 'liked' | 'reading_list' | 'all';
  status?: ReadingStatus;
}

interface BookFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CATEGORIES: { value: FilterState['category']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'liked', label: 'Liked' },
  { value: 'reading_list', label: 'Reading List' },
];

export const BookFilters = ({ filters, onChange }: BookFiltersProps) => {
  const [statusOpen, setStatusOpen] = useState(false);

  const currentStatusConfig = READING_STATUS_OPTIONS.find((s) => s.value === filters.status);
  const triggerAccent: PillColorAccent = currentStatusConfig?.colorAccent ?? 'neutral';

  const handleSelectStatus = (status?: ReadingStatus) => {
    setStatusOpen(false);
    onChange({ ...filters, status });
  };

  const statusItems: DropdownItem[] = [
    {
      label: 'All statuses',
      dotColor: 'neutral',
      isActive: !filters.status,
      onClick: () => handleSelectStatus(undefined),
    },
    ...READING_STATUS_OPTIONS.map((cfg) => ({
      label: cfg.label,
      dotColor: cfg.colorAccent,
      isActive: filters.status === cfg.value,
      onClick: () => handleSelectStatus(cfg.value),
    })),
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={[styles.tab, filters.category === cat.value ? styles.tabActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange({ ...filters, category: cat.value })}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={styles.statusFilter}>
        <Dropdown
          trigger={
            <IconPillButton
              aria-label={currentStatusConfig?.label ?? 'All statuses'}
              aria-expanded={statusOpen}
              onClick={() => setStatusOpen((o) => !o)}
              colorAccent={triggerAccent}
              icon={<BookOpen size={15} />}
              rightIcon={<ChevronDown size={14} />}
            >
              {currentStatusConfig?.label ?? 'All statuses'}
            </IconPillButton>
          }
          items={statusItems}
          isOpen={statusOpen}
          onClose={() => setStatusOpen(false)}
          align="right"
        />
      </div>
    </div>
  );
};
