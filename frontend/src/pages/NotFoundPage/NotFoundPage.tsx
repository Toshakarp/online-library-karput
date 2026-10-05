import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Button } from '@/shared/ui/Button/Button';
import { ROUTES } from '@/shared/config/routes';
import illustration7 from '@/assets/illustration7.svg';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer size="md">
      <EmptyState
        illustrationSrc={illustration7}
        title="404 — Page Not Found"
        description="The page or book you are looking for does not exist or has been moved."
        actionSlot={
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
            Back to Home
          </Button>
        }
      />
    </PageContainer>
  );
};

export default NotFoundPage;
