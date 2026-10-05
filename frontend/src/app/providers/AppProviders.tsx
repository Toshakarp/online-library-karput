import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from './ToastProvider';
import { AuthModalProvider } from './AuthModalProvider';
import { SessionHydrator } from './SessionHydrator';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <BrowserRouter>
      <ToastProvider>
        <AuthModalProvider>
          <SessionHydrator />
          {children}
        </AuthModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
