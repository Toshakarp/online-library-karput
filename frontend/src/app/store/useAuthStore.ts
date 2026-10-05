import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from 'shared-types';
import { AUTH_STORAGE_KEY } from '@/shared/lib/auth/authToken';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const initialState = {
  token: null as string | null,
  user: null as UserProfile | null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set(initialState),

      updateProfile: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        })),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
