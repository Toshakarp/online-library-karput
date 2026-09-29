import { useState, useCallback, type ReactNode } from 'react';
import { AuthModalContext } from '@/shared/lib/modal/ModalContext';
import { Modal } from '@/shared/ui/Modal/Modal';
import { AuthForm } from '@/features/auth';

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
      <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal}>
        <AuthForm onSuccess={closeAuthModal} />
      </Modal>
    </AuthModalContext.Provider>
  );
};
