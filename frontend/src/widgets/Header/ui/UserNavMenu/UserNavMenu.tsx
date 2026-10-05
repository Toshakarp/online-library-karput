import { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from 'shared-types';
import { useAuthStore } from '@/app/store/useAuthStore';
import { Dropdown, DropdownItem } from '@/shared/ui/Dropdown/Dropdown';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { DESKTOP_USER_DROPDOWN } from '../../model/nav-config';
import styles from './UserNavMenu.module.scss';

interface UserNavMenuProps {
  user: UserProfile;
}

export const UserNavMenu = memo(({ user }: UserNavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const dropdownItems = useMemo<DropdownItem[]>(() => {
    return DESKTOP_USER_DROPDOWN.map((item) => {
      const isSignOut = item.id === 'sign-out';
      const Icon = item.icon;

      return {
        label: item.label,
        icon: <Icon size={16} />,
        danger: item.danger,
        dividerBefore: item.dividerBefore,
        onClick: () => {
          setIsOpen(false);
          if (isSignOut) {
            logout();
          }
          navigate(item.to);
        },
      };
    });
  }, [logout, navigate]);

  return (
    <div className={styles.userTriggerWrapper}>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        align="right"
        trigger={
          <button
            type="button"
            className={styles.avatarTrigger}
            onClick={() => setIsOpen((open) => !open)}
            aria-label="User menu"
          >
            <Avatar
              src={user.avatarUrl ?? undefined}
              name={user.displayName || user.username}
              size="sm"
            />
          </button>
        }
        items={dropdownItems}
      />
    </div>
  );
});

UserNavMenu.displayName = 'UserNavMenu';
