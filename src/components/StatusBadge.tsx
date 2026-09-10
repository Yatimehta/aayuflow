import React from 'react';
import { PatientStatus } from '../types';

interface StatusBadgeProps {
  status: PatientStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  // Map statuses to dot colors:
  // Green dot for Verified / Optimal / Completed / Low
  // Amber dot for Pending / Suboptimal / In Progress / Medium
  // Blue/Cyan dot for Processing / Normal
  // Red/Rose dot for Rejected / Critical / High / Waiting
  const getDotColor = () => {
    switch (status) {
      case 'Verified':
      case 'Completed':
      case 'Optimal':
      case 'Low':
        return 'bg-emerald-500';
      case 'Pending':
      case 'Suboptimal':
      case 'In Progress':
      case 'Moderate':
      case 'Medium':
        return 'bg-amber-500';
      case 'Processing':
        return 'bg-sky-500 animate-pulse';
      case 'Rejected':
      case 'Critical':
      case 'High':
      case 'Waiting':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'Verified':
        return 'Verified';
      case 'Pending':
        return 'Pending Review';
      case 'Processing':
        return 'AI Processing';
      case 'Rejected':
        return 'Changes Needed';
      default:
        return status;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-2',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-800 shadow-xs ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getDotColor()}`} />
      <span className="truncate">{getLabel()}</span>
    </span>
  );
};
