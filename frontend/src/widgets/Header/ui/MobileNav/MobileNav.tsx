import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { UserProfile } from 'shared-types';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { MOBILE_NAV_ITEMS, NAV_ITEMS } from '../../model/nav-config';
import { HeaderNavLink } from '../HeaderNavLink/HeaderNavLink';
import linkStyles from '../HeaderNavLink/HeaderNavLink.module.scss';
import styles from './MobileNav.module.scss';

interface MobileNavProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export const MobileNav = memo(({ user, isAuthenticated }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleSignOut = useCallback(() => {
    closeMenu();
    logout();
    navigate(NAV_ITEMS.HOME.to);
  }, [closeMenu, logout, navigate]);

  const handleSignIn = useCallback(() => {
    closeMenu();
    openAuthModal();
  }, [closeMenu, openAuthModal]);

  return (
    <div className={styles.mobileContainer}>
      {isAuthenticated && user && (
        <button
          type="button"
          className={styles.avatarTrigger}
          onClick={toggleMenu}
          aria-label="Toggle user navigation menu"
        >
          <Avatar
            src={user.avatarUrl ?? undefined}
            name={user.displayName || user.username}
            size="sm"
          />
        </button>
      )}

      <IconButton label={isOpen ? 'Close menu' : 'Open menu'} size="md" onClick={toggleMenu}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </IconButton>

      {isOpen && (
        <nav className={styles.drawer}>
          {isAuthenticated && user ? (
            MOBILE_NAV_ITEMS.map((item) => {
              if (item.id === 'sign-out') {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${linkStyles.mobileNavLink} ${styles.signOutBtn}`}
                    onClick={handleSignOut}
                  >
                    <span className={linkStyles.icon}>
                      <Icon size={20} />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <HeaderNavLink key={item.id} item={item} variant="mobile" onClick={closeMenu} />
              );
            })
          ) : (
            <>
              <HeaderNavLink item={NAV_ITEMS.HOME} variant="mobile" onClick={closeMenu} />
              <button type="button" className={linkStyles.mobileNavLink} onClick={handleSignIn}>
                <span className={linkStyles.icon}>
                  <UserIcon size={20} />
                </span>
                <span>Sign in</span>
              </button>
            </>
          )}
        </nav>
      )}
    </div>
  );
});

MobileNav.displayName = 'MobileNav';
