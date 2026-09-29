import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { useAuthStore } from '@/app/store/useAuthStore';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ROUTES } from '@/shared/config/routes';
import authIllustration from '@/assets/illustration2.svg';
import styles from './AuthPage.module.scss';

interface LocationState {
  from?: { pathname: string };
}

const AuthPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (isAuthenticated) {
      const from = state?.from?.pathname ?? ROUTES.HOME;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, state]);

  return (
    <div className={styles.page}>
      <div className={styles.illustrationPanel}>
        <EmptyState
          illustrationSrc={authIllustration}
          title="Your personal library"
          description="Track what you read, discover new books, and share your thoughts with fellow readers."
        />
      </div>
      <div className={styles.formPanel}>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
