import { useState, memo, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar = memo(({
  onSearch,
  placeholder = 'Search books by title or author...',
  initialValue = '',
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrap}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          leftIcon={<Search size={16} />}
          rightIcon={
            query ? (
              <IconButton label="Clear search" size="sm" onClick={handleClear}>
                <X size={14} />
              </IconButton>
            ) : undefined
          }
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
});

SearchBar.displayName = 'SearchBar';