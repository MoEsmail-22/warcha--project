/**
 * Badge — small pill-shaped status label.
 * Usage: <Badge status="pending" />  → amber pill saying "Pending"
 */
import { cn } from '@/utils/cn';

const STATUS_CLASSES = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  in_service: 'badge-in-service',
  in_progress: 'badge-in-progress',
  inProgress: 'badge-in-progress',
  new: 'badge-new',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
  delayed: 'badge-delayed',
  urgent: 'badge-urgent',
  draft: 'badge-draft',
  sent: 'badge-sent',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
  expired: 'badge-expired',
};

function defaultLabel(status) {
  if (status === 'in_service') return 'In service';
  if (status === 'new') return 'New';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Badge({ status = 'pending', children, className }) {
  const statusClass = STATUS_CLASSES[status] ?? 'badge-draft';
  return (
    <span className={cn('badge', statusClass, className)}>{children ?? defaultLabel(status)}</span>
  );
}

export default Badge;
