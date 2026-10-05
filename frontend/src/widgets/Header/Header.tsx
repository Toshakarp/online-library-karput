import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useAuthModal } from '@/shared/lib/modal/ModalContext';
import { ROUTES } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button/Button';
import { DesktopNav } from './ui/DesktopNav/DesktopNav';
import { UserNavMenu } from './ui/UserNavMenu/UserNavMenu';
import { MobileNav } from './ui/MobileNav/MobileNav';
import styles from './Header.module.scss';

export const Header = memo(() => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <Link to={ROUTES.HOME} className={styles.logo} aria-label="Home page">
            <div className={styles.logoIcon}>
              <BookOpen size={20} />
            </div>
          </Link>
        </div>

        <div className={styles.rightSection}>
          {isAuthenticated && <DesktopNav />}

          {isAuthenticated && user ? (
            <UserNavMenu user={user} />
          ) : (
            <div className={styles.desktopAuthBtn}>
              <Button size="sm" onClick={openAuthModal}>
                Sign in
              </Button>
            </div>
          )}

          <MobileNav user={user} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
