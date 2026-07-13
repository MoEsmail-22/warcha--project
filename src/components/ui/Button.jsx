/**
 * Button — primary action button.
 *
 * Uses .btn-* classes from index.css (Phase 1 design):
 *   - primary  → teal background, white text
 *   - accent   → orange background, white text
 *   - outline  → white bg, gray border
 *   - ghost    → no background, subtle hover
 *   - danger   → red background
 *
 * Sizes: sm | md | lg
 *
 * Accepts all native <button> props (onClick, disabled, type, etc.).
 * The className prop merges via cn() so parents can override any class.
 */
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZES = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button className={cn('btn', VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
