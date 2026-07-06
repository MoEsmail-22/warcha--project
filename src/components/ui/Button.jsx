/**
 * Button — primary action button.
 * Variants: primary | accent | outline | ghost | danger
 * Sizes:    sm | md | lg
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
