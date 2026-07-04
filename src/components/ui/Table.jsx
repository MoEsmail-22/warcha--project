/**
 * Table primitives — composable building blocks.
 * <Table><THead><TR><TH>...</TH></TR></THead><TBody>...</TBody></Table>
 */
import { cn } from '@/utils/cn';

export function Table({ className, children }) {
  return (
    <table className={cn('w-full border-collapse text-left text-sm', className)}>{children}</table>
  );
}

export function THead({ className, children }) {
  return <thead className={cn('border-b border-gray-200 bg-gray-50', className)}>{children}</thead>;
}

export function TBody({ className, children }) {
  return <tbody className={cn('divide-y divide-gray-100', className)}>{children}</tbody>;
}

export function TR({ className, children, ...props }) {
  return (
    <tr className={cn('transition-colors hover:bg-gray-50', className)} {...props}>
      {children}
    </tr>
  );
}

export function TH({ className, children }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TD({ className, children, ...props }) {
  return (
    <td className={cn('px-4 py-3 text-gray-900', className)} {...props}>
      {children}
    </td>
  );
}

export default Object.assign(Table, { THead, TBody, TR, TH, TD });
