import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Library, User, Menu, X, LogOut, Settings, Heart } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { ROUTES } from '@/shared/config/routes';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { Button } from '@/shared/ui/Button/Button';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Dropdown, DropdownItem } from '@/shared/ui/Dropdown/Dropdown';
import styles from './Header.module.scss';

export const Header = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const userMenuItems: DropdownItem[] = [
    { label: 'Profile', icon: <User size={14} />, onClick: () => navigate(ROUTES.PROFILE) },
    { label: 'My Books', icon: <Library size={14} />, onClick: () => navigate(ROUTES.MY_BOOKS) },
    { label: 'Change Password', icon: <Settings size={14} />, onClick: () => navigate(ROUTES.CHANGE_PASSWORD) },
    {
      label: 'Sign out', icon: <LogOut size={14} />, onClick: handleLogout,
      danger: true, dividerBefore: true,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <div className={styles.logoIcon}><BookOpen size={20} /></div>
        </Link>

        <nav className={styles.nav}>
          <NavLink to={ROUTES.HOME} end
            className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')}>
            <Home size={16} /> Home
          </NavLink>
        </nav>

        <div className={styles.actions}>
          {isAuthenticated && user ? (
            <>
              <IconButton
                label="Liked books"
                onClick={() => navigate(ROUTES.MY_BOOKS_CATEGORY('liked'))}
              >
                <Heart size={18} />
              </IconButton>
              <NavLink
                to={ROUTES.MY_BOOKS}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')
                }
              >
                <Library size={16} /> My Books
              </NavLink>
              <Dropdown
                trigger={
                  <button className={styles.userTrigger} onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="User menu" aria-expanded={userMenuOpen}>
                    <Avatar src={user.avatarUrl ?? undefined} name={user.displayName || user.username} size="sm" />
                    <span className={styles.userName}>{user.displayName || user.username}</span>
                  </button>
                }
                items={userMenuItems}
                isOpen={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
              />
            </>
          ) : (
            <Button size="sm" onClick={openAuthModal}>Sign in</Button>
          )}

          <IconButton label={mobileOpen ? 'Close menu' : 'Open menu'} size="md" className={styles.hamburger}
            onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </div>
      </div>

      {mobileOpen && (
        <nav className={styles.mobileNav} onClick={() => setMobileOpen(false)}>
          <NavLink to={ROUTES.HOME} end
            className={({ isActive }) => [styles.mobileNavLink, isActive ? styles.mobileNavLinkActive : ''].filter(Boolean).join(' ')}>
            <Home size={18} /> Home
          </NavLink>
          {isAuthenticated && user ? (
            <>
              <div className={styles.mobileDivider} />
              <NavLink
                to={ROUTES.PROFILE}
                className={({ isActive }) => [styles.mobileNavLink, isActive ? styles.mobileNavLinkActive : ''].filter(Boolean).join(' ')}
              >
                <User size={18} /> Profile
              </NavLink>
              <NavLink
                to={ROUTES.MY_BOOKS}
                className={({ isActive }) => [styles.mobileNavLink, isActive ? styles.mobileNavLinkActive : ''].filter(Boolean).join(' ')}
              >
                <Library size={18} /> My Books
              </NavLink>
              <NavLink
                to={ROUTES.CHANGE_PASSWORD}
                className={({ isActive }) => [styles.mobileNavLink, isActive ? styles.mobileNavLinkActive : ''].filter(Boolean).join(' ')}
              >
                <Settings size={18} /> Change Password
              </NavLink>
              <div className={styles.mobileDivider} />
              <button className={[styles.mobileNavLink, styles.signOutBtn].join(' ')}
                onClick={handleLogout}>
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <>
              <div className={styles.mobileDivider} />
              <button className={styles.mobileNavLink} onClick={openAuthModal}><User size={18} /> Sign in</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
