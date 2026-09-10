import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const Icon = isSuccess ? CheckCircle2 : isError || isWarning ? AlertCircle : Info;
        const borderClass = isSuccess
          ? 'border-emerald-200 bg-white'
          : isError
          ? 'border-rose-200 bg-white'
          : isWarning
          ? 'border-amber-200 bg-white'
          : 'border-brand-border bg-white';

        const iconColor = isSuccess
          ? 'text-emerald-500'
          : isError
          ? 'text-rose-500'
          : isWarning
          ? 'text-amber-500'
          : 'text-brand-teal-dark';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-soft-lg transition-all animate-in slide-in-from-bottom-5 duration-200 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-bold text-brand-heading">{toast.title}</p>
              <p className="text-xs text-brand-body mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-brand-muted hover:text-brand-heading hover:bg-brand-bg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
