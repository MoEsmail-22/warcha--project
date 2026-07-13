/**
 * ErrorState — error message with retry button.
 *
 * RTL-aware: uses logical properties (me-1 = margin-inline-end).
 *
 * Props:
 *   title, description, onRetry, className
 */
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

export function ErrorState({ title, description, onRetry, className }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={28} />
      </div>

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}

      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>
            {/* me-1 = margin-inline-end (right in LTR, left in RTL) */}
            <RefreshCw size={16} className="me-1" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
