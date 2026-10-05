import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { profileApi } from '@/entities/user';
import { setUnauthorizedHandler } from '@/shared/api/apiClient';

export const SessionHydrator = () => {
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    if (!token) return;
    profileApi
      .getMe()
      .then((profile) => login(profile, token))
      .catch(() => logout());
  }, [token, login, logout]);

  return null;
};
