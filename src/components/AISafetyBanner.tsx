import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface AISafetyBannerProps {
  className?: string;
  variant?: 'subtle' | 'prominent' | 'compact';
  customText?: string;
}

export const AISafetyBanner: React.FC<AISafetyBannerProps> = ({
  className = '',
  variant = 'prominent',
  customText
}) => {
  const defaultText = 'AI-generated information — doctor verification required. This is not a diagnosis.';

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium backdrop-blur-md ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span>{customText || defaultText}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-md p-3.5 sm:p-4 shadow-sm ${className}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 shadow-xs">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Clinical Safety Notice
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Doctor-in-the-Loop
            </span>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/90 font-medium mt-0.5">
            ⚠ {customText || defaultText}
          </p>
        </div>
      </div>
    </div>
  );
};
