import { Component, type ReactNode } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer/PageContainer';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <PageContainer size="sm">
            <ErrorState
              title="Something went wrong"
              message={this.state.error?.message}
              onRetry={() => window.location.reload()}
            />
          </PageContainer>
        )
      );
    }
    return this.props.children;
  }
}
