import { createContext, use } from 'react';

export interface AuthModalActions {
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const AuthModalStateContext = createContext<boolean>(false);
export const AuthModalActionsContext = createContext<AuthModalActions | null>(null);

export const useAuthModal = (): AuthModalActions => {
  const ctx = use(AuthModalActionsContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
};

export const useAuthModalState = (): boolean => {
  return use(AuthModalStateContext);
};
