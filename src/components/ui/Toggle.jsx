/**
 * Toggle — on/off switch for settings.
 */
import { cn } from '@/utils/cn';

export function Toggle({ checked, onChange, label, description, id, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label htmlFor={id} className="block text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
      )}

      <div className="relative inline-flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            'h-6 w-11 rounded-full transition-colors',
            checked ? 'bg-primary' : 'bg-gray-300',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
        <span
          className={cn(
            'absolute start-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
    </div>
  );
}

export default Toggle;
