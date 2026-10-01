import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Button } from '@/shared/ui/Button/Button';
import { ROUTES } from '@/shared/config/routes';
import illustration7 from '@/assets/illustration7.svg';

export interface NotFoundPageProps {
    title?: string;
    description?: string;
}

const NotFoundPage = ({
    title = '404 — Page Not Found',
    description = 'The page you are looking for does not exist or has been moved.',
}: NotFoundPageProps) => {
    const navigate = useNavigate();

    return (
        <PageContainer size="md">
            <EmptyState
                illustrationSrc={illustration7}
                title={title}
                description={description}
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
