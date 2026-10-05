import { memo } from 'react';
import { DESKTOP_MAIN_NAV } from '../../model/nav-config';
import { HeaderNavLink } from '../HeaderNavLink/HeaderNavLink';
import styles from './DesktopNav.module.scss';

export const DesktopNav = memo(() => {
  return (
    <nav className={styles.desktopNav}>
      {DESKTOP_MAIN_NAV.map((item) => (
        <HeaderNavLink key={item.id} item={item} variant="desktop" />
      ))}
    </nav>
  );
});

DesktopNav.displayName = 'DesktopNav';
