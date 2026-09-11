import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'teal' | 'blue' | 'mint' | 'amber';
  onClick?: () => void;
  isActive?: boolean;
  compact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'teal',
  onClick,
  isActive = false,
  compact = false
}) => {
  const variantStyles = {
    teal: {
      iconBg: 'bg-[#E4EFEC] text-[#146356] border border-[#9FDCD1]',
      trendColor: 'text-[#146356]'
    },
    blue: {
      iconBg: 'bg-[#E4EFEC] text-[#146356] border border-[#9FDCD1]',
      trendColor: 'text-[#146356]'
    },
    mint: {
      iconBg: 'bg-[#CEF3ED] text-[#146356] border border-[#9FDCD1]',
      trendColor: 'text-[#146356]'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200/80',
      trendColor: 'text-amber-800'
    }
  }[variant];

  if (compact) {
    return (
      <div className="rounded-2xl border border-[#DCEAE7] bg-white shadow-2xs py-2.5 px-3.5 select-none">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              {title}
            </p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#0D2B3E] font-sans truncate">
                {value}
              </span>
              {trend && (
                <span className={`inline-flex items-center text-[10px] font-bold ${variantStyles.trendColor}`}>
                  {trend}
                </span>
              )}
            </div>
          </div>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${variantStyles.iconBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 p-5 select-none ${
        isActive
          ? 'bg-[#E4EFEC]/40 border-[#146356] ring-2 ring-[#146356]/20 shadow-md'
          : 'bg-white border-[#DCEAE7] shadow-xs'
      } ${
        onClick ? 'cursor-pointer hover:border-[#146356]/60 hover:shadow-sm transform hover:-translate-y-0.5 active:scale-98' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {value}
            </span>
            {trend && (
              <span className={`inline-flex items-center text-xs font-semibold ${variantStyles.trendColor}`}>
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${variantStyles.iconBg} shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
