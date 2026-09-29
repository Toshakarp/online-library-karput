import { Fragment, useRef, type ReactNode } from 'react';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import styles from './Dropdown.module.scss';

export type DropdownDotColor = 'yellow' | 'purple' | 'green' | 'neutral';

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  dotColor?: DropdownDotColor;
  onClick: () => void;
  danger?: boolean;
  dividerBefore?: boolean;
  isActive?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
}

export const Dropdown = ({
  trigger,
  items,
  isOpen,
  onClose,
  align = 'right',
}: DropdownProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapRef, onClose, isOpen);

  const menuClasses = [
    styles.menu,
    align === 'left' ? styles.alignLeft : styles.alignRight,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper} ref={wrapRef}>
      {trigger}
      {isOpen && (
        <div className={menuClasses} role="menu">
          {items.map((item, idx) => (
            <Fragment key={idx}>
              {item.dividerBefore && <div className={styles.divider} />}
              <button
                type="button"
                className={[
                  styles.item,
                  item.danger ? styles.danger : '',
                  item.isActive ? styles.active : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                role="menuitem"
              >
                {item.dotColor && (
                  <span
                    className={[
                      styles.dot,
                      styles[`dot${item.dotColor.charAt(0).toUpperCase() + item.dotColor.slice(1)}`],
                    ].join(' ')}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
