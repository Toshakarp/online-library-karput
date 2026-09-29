import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { ProtectedRoute } from './ProtectedRoute';
import { Header } from '@/widgets/Header';
import { Spinner } from '@/shared/ui/Spinner/Spinner';

const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const AuthPage = lazy(() => import('@/pages/AuthPage/AuthPage'));
const BookDetailsPage = lazy(() => import('@/pages/BookDetailsPage/BookDetailsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/ProfilePage'));
const MyBooksPage = lazy(() => import('@/pages/MyBooksPage/MyBooksPage'));
const MyCommentsPage = lazy(() => import('@/pages/MyCommentsPage/MyCommentsPage'));
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage/ChangePasswordPage'));

const PageLoader = () => (
  <div className="pageLoader">
    <Spinner size="lg" centered />
  </div>
);

export const AppRouter = () => (
  <>
    <Header />
    <main className="appMain">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailsPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_BOOKS}
            element={
              <ProtectedRoute>
                <MyBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_COMMENTS}
            element={
              <ProtectedRoute>
                <MyCommentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CHANGE_PASSWORD}
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </main>
  </>
);
