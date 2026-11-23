import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface FirebaseErrorBoundaryProps {
  children: React.ReactNode;
}

interface FirebaseErrorBoundaryState {
  hasError: boolean;
  friendlyMessage: string;
}

export class FirebaseErrorBoundary extends React.Component<
  FirebaseErrorBoundaryProps,
  FirebaseErrorBoundaryState
> {
  constructor(props: FirebaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, friendlyMessage: '' };
  }

  static getDerivedStateFromError(error: Error): FirebaseErrorBoundaryState {
    let friendlyMessage =
      'No fue posible conectar con la base de datos del blog del taller en este momento.';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed.error === 'string') {
        if (parsed.error.toLowerCase().includes('permission')) {
          friendlyMessage =
            'No cuentas con permisos suficientes para esta operación o tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo.';
        } else if (parsed.error.toLowerCase().includes('quota')) {
          friendlyMessage =
            'Se alcanzó temporalmente el límite de consultas de la base de datos. Intenta nuevamente en unos minutos.';
        }
      }
    } catch {
      // keep default friendly message
    }
    return { hasError: true, friendlyMessage };
  }

  componentDidCatch(error: Error) {
    console.error('FirebaseErrorBoundary caught:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, friendlyMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-2xl bg-white dark:bg-[#16161C] border border-red-200 dark:border-red-900/50 p-8 text-center space-y-4"
        >
          <AlertTriangle className="w-8 h-8 mx-auto text-red-600 dark:text-red-400" />
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              Ocurrió un problema con el Blog del Taller
            </h3>
            <p className="text-sm text-[#5B5B66] dark:text-[#A09E97]">
              {this.state.friendlyMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
