import React from 'react';
import { AlertCircle, Flame } from 'lucide-react';

interface PriorityFlagProps {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  pulse?: boolean;
}

export const PriorityFlag: React.FC<PriorityFlagProps> = ({
  className = '',
  label = 'Priority Review',
  size = 'md',
  animated = true,
  pulse
}) => {
  const isPulsing = pulse !== undefined ? pulse : animated;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-xs font-bold gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/50 text-amber-800 dark:text-amber-300 shadow-sm backdrop-blur-md ${sizeClasses[size]} ${
        isPulsing ? 'animate-pulse' : ''
      } ${className}`}
      title="Severe or acute symptoms reported — flagged for priority doctor triage"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <AlertCircle className={`${iconSizes[size]} text-amber-500`} />
      <span>{label}</span>
    </span>
  );
};
