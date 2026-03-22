import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-md w-full p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <h2 className="text-2xl font-black text-red-500 mb-4 uppercase tracking-tighter">System Error</h2>
            <p className="text-white/60 mb-6 font-medium">
              Wenn encountered an unexpected issue. Please refresh the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
            >
              Reload System
            </button>
            {this.state.error && (
              <pre className="mt-8 p-4 bg-black/50 rounded-xl text-[10px] text-red-400/50 text-left overflow-auto max-h-40 font-mono">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
