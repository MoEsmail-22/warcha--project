/**
 * EmptyState — friendly placeholder when there's no data.
 *
 * RTL-aware: Symmetric centered layout, no direction-specific code.
 * Works in both LTR and RTL automatically.
 */
import { cn } from '@/utils/cn';

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
    >
      {icon && (
        <div className="bg-primary-50 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
