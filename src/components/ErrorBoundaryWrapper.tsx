import React, { ReactNode } from 'react';
import Button from '../UI/Button';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack?: string } | null;
}

class ErrorBoundaryWrapper extends React.Component<ErrorBoundaryWrapperProps, ErrorState> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    } as any);
  }

  componentDidMount() {
    // Handle global runtime errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      this.setState({ 
        hasError: true, 
        error: event.error || new Error(event.message) 
      });
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      const errorMsg = event.reason?.message || String(event.reason);
      this.setState({
        hasError: true,
        error: new Error(errorMsg),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Store references for cleanup
    (this as any).handleError = handleError;
    (this as any).handleUnhandledRejection = handleUnhandledRejection;
  }

  componentWillUnmount() {
    window.removeEventListener('error', (this as any).handleError);
    window.removeEventListener('unhandledrejection', (this as any).handleUnhandledRejection);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen w-screen" style={{
          background: "linear-gradient(135deg, #414593 0%, #00022E 100%)",
          backgroundBlendMode: "hard-light",
        }}>
          <div
            className="relative p-12 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center"
            style={{
              background: "linear-gradient(135deg, #414593 0%, #00022E 100%)",
              backgroundBlendMode: "hard-light",
            }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-200 text-sm font-semibold mb-4">Error Details:</p>
              <p className="text-gray-300 mb-6 text-sm bg-gray-900 bg-opacity-50 p-3 rounded break-words">
                {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mb-4 text-xs text-gray-300 bg-gray-900 bg-opacity-30 p-2 rounded">
                  <summary className="cursor-pointer font-semibold mb-2">Stack Trace (Dev Only)</summary>
                  <pre className="overflow-auto max-h-40 whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                label="Go Home"
                color="dangerText"
                onClick={() => {
                  this.resetError();
                  window.location.href = '/';
                }}
                customStyle="w-full"
              />
              <Button
                label="Refresh"
                color="secondary"
                onClick={() => window.location.reload()}
                customStyle="w-full"
              />
            </div>

            <div className="mt-6 text-xs text-gray-300">
              Please refresh the page or return to home
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;