import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<CardProps> = ({ title, value, icon, description, trend, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-xs font-medium",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-slate-400 ml-1 font-normal text-[10px]">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  );
};
