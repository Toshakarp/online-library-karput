export const AUTH_STORAGE_KEY = 'baca-auth';

interface PersistedAuthState {
  state?: {
    token?: string | null;
  };
}

export const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAuthState;
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};
