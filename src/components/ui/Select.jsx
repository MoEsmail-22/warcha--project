/**
 * Select — dropdown with optional label.
 */
import { cn } from '@/utils/cn';

export function Select({ label, id, children, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <select id={id} className={cn('input', className)} {...props}>
        {children}
      </select>
    </div>
  );
}

export default Select;
