const STATUS_STYLES = {
  sent: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Sent - awaiting' },
  accepted: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Declined' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300', label: 'Expired' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Draft' },
};

export default function QuoteStatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.sent;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
