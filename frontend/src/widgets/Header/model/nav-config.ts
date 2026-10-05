import { Home, User, Library, Settings, LogOut, Heart, type LucideIcon } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  danger?: boolean;
  dividerBefore?: boolean;
  exact?: boolean;
}

export const NAV_ITEMS = {
  HOME: { id: 'home', label: 'Home', to: ROUTES.HOME, icon: Home, exact: true },
  MY_BOOKS: { id: 'my-books', label: 'My Books', to: ROUTES.MY_BOOKS, icon: Library, exact: true },
  LIKES: { id: 'likes', label: 'Likes', to: ROUTES.MY_BOOKS_CATEGORY('liked'), icon: Heart },
  PROFILE: { id: 'profile', label: 'Profile', to: ROUTES.PROFILE, icon: User, exact: true },
  CHANGE_PASSWORD: {
    id: 'change-password',
    label: 'Change Password',
    to: ROUTES.CHANGE_PASSWORD,
    icon: Settings,
    exact: true,
  },
  SIGN_OUT: {
    id: 'sign-out',
    label: 'Sign out',
    to: ROUTES.HOME,
    icon: LogOut,
    danger: true,
    dividerBefore: true,
  },
} as const satisfies Record<string, NavItem>;

export const DESKTOP_MAIN_NAV: NavItem[] = [NAV_ITEMS.HOME, NAV_ITEMS.MY_BOOKS];

export const DESKTOP_USER_DROPDOWN: NavItem[] = [
  NAV_ITEMS.PROFILE,
  NAV_ITEMS.LIKES,
  NAV_ITEMS.CHANGE_PASSWORD,
  NAV_ITEMS.SIGN_OUT,
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS.HOME,
  NAV_ITEMS.PROFILE,
  NAV_ITEMS.MY_BOOKS,
  NAV_ITEMS.LIKES,
  NAV_ITEMS.CHANGE_PASSWORD,
  NAV_ITEMS.SIGN_OUT,
];

export const isNavItemActive = (item: NavItem, pathname: string, search: string): boolean => {
  const [itemPath, itemQuery] = item.to.split('?');
  const currentParams = new URLSearchParams(search);
  const itemParams = new URLSearchParams(itemQuery || '');

  if (item.exact) {
    if (pathname !== itemPath) return false;
  } else {
    if (pathname !== itemPath && !pathname.startsWith(`${itemPath}/`)) {
      return false;
    }
  }

  const targetCategory = itemParams.get('category');
  const currentCategory = currentParams.get('category');

  if (targetCategory) {
    return currentCategory === targetCategory;
  }

  if (itemPath === ROUTES.MY_BOOKS && currentCategory === 'liked') {
    return false;
  }

  return true;
};
