import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { AuthModalStateContext, AuthModalActionsContext } from '@/shared/lib/modal/ModalContext';
import { Modal } from '@/shared/ui/Modal/Modal';
import { AuthForm } from '@/features/auth';

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const actions = useMemo(
    () => ({ openAuthModal, closeAuthModal }),
    [openAuthModal, closeAuthModal],
  );

  return (
    <AuthModalActionsContext value={actions}>
      <AuthModalStateContext value={isAuthModalOpen}>
        {children}
        {isAuthModalOpen && (
          <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal}>
            <AuthForm onSuccess={closeAuthModal} />
          </Modal>
        )}
      </AuthModalStateContext>
    </AuthModalActionsContext>
  );
};
