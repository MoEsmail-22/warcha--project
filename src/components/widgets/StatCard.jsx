/**
 * StatCard — KPI metric card.
 * Layout matches Figma: icon + big number + label + subtext (with arrow).
 */
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const TREND_CLASSES = {
  up: 'text-status-completed',
  down: 'text-status-cancelled',
  neutral: 'text-primary-600',
};

export function StatCard({ icon, value, label, subtext, trend = 'neutral', onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card rounded-xl bg-white p-6 shadow-sm',
        onClick && 'card-hover cursor-pointer'
      )}
    >
      {icon && (
        <div className="bg-primary-50 text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
          {icon}
        </div>
      )}
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
      {subtext && (
        <p className={cn('mt-2 flex items-center gap-1 text-xs font-medium', TREND_CLASSES[trend])}>
          {trend === 'up' && <ArrowUp size={12} />}
          {trend === 'down' && <ArrowDown size={12} />}
          {subtext}
        </p>
      )}
    </div>
  );
}

export default StatCard;
