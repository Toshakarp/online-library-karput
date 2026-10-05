import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem, isNavItemActive } from '../../model/nav-config';
import styles from './HeaderNavLink.module.scss';

interface HeaderNavLinkProps {
  item: NavItem;
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const HeaderNavLink = memo(({ item, variant = 'desktop', onClick }: HeaderNavLinkProps) => {
  const isMobile = variant === 'mobile';
  const baseClass = isMobile ? styles.mobileNavLink : styles.navLink;
  const activeClass = isMobile ? styles.mobileNavLinkActive : styles.navLinkActive;

  const location = useLocation();
  const Icon = item.icon;

  const isActive = isNavItemActive(item, location.pathname, location.search);

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : ''}`}
    >
      <span className={styles.icon}>
        <Icon size={isMobile ? 20 : 18} />
      </span>
      <span>{item.label}</span>
    </NavLink>
  );
});

HeaderNavLink.displayName = 'HeaderNavLink';
