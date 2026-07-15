const STATUS_STYLES = {
  pending: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Pending' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Confirmed' },
  in_progress: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    label: 'In Progress',
  },
  completed: { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-600', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
};

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
