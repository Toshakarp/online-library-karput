import { useNavigate } from 'react-router-dom';
import { ChangePasswordForm } from '@/features/auth';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer size="sm">
      <PageHeader onBack={() => navigate(-1)} />
      <ChangePasswordForm onSuccess={() => navigate(-1)} onCancel={() => navigate(-1)} />
    </PageContainer>
  );
};

export default ChangePasswordPage;
