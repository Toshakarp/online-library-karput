import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { profileApi } from '@/entities/user';

export const SessionHydrator = () => {
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!token || user) return;
    profileApi
      .getMe()
      .then((profile) => login(profile, token))
      .catch(() => logout());
  }, [token, user, login, logout]);

  return null;
};
