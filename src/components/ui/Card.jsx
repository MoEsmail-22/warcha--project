/**
 * Card — base container.
 * Props:
 *   hover   → if true, stronger shadow on hover
 *   padded  → if true (default), adds p-6
 */
import { cn } from '@/utils/cn';

export function Card({ hover = false, padded = true, className, children, ...props }) {
  return (
    <div className={cn('card', hover && 'card-hover', padded && 'p-6', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
