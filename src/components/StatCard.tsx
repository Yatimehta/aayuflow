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
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'teal',
  onClick
}) => {
  const variantStyles = {
    teal: {
      iconBg: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      trendColor: 'text-teal-700'
    },
    blue: {
      iconBg: 'bg-sky-50 text-sky-700 border border-sky-200/60',
      trendColor: 'text-sky-700'
    },
    mint: {
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      trendColor: 'text-emerald-700'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      trendColor: 'text-amber-700'
    }
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5' : ''
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
