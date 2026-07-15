/**
 * SkeletonCard — animated loading placeholder.
 *
 * RTL-aware: Pure shapes with symmetric spacing.
 * Works in both LTR and RTL automatically.
 */
import { cn } from '@/utils/cn';

const ROUNDED = {
  none: '',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function SkeletonCard({ className, rounded = 'md' }) {
  return <div className={cn('animate-pulse bg-gray-200', ROUNDED[rounded], className)} />;
}

export function SkeletonStatCard() {
  return (
    <div className="card p-6">
      <SkeletonCard className="mb-4 h-10 w-10" rounded="lg" />
      <SkeletonCard className="h-8 w-20" />
      <SkeletonCard className="mt-2 h-4 w-32" />
      <SkeletonCard className="mt-3 h-3 w-24" />
    </div>
  );
}

export function SkeletonRow({ columns = 4 }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonCard key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

export default SkeletonCard;
