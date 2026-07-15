/**
 * DataTable — table with built-in loading/empty/error states.
 *
 * RTL-aware:
 *   - Uses logical text alignment (text-start instead of text-left)
 *   - CustomerCell avatar appears on the right in RTL (flexbox auto-reverses)
 *   - Table direction follows the dir attribute on <html>
 *
 * Props:
 *   columns, data, loading, error, onRetry, emptyTitle, emptyDesc, emptyIcon,
 *   rowKey, onRowClick
 */
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { cn } from '@/utils/cn';

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'Nothing here yet',
  emptyDesc = 'No data to display.',
  emptyIcon,
  rowKey = 'id',
  onRowClick,
}) {
  // ===== Loading state =====
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              {columns.map((col) => (
                <TH key={col.key}>{col.header}</TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TR key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <TD key={col.key}>
                    <SkeletonCard className="h-4 w-24" />
                  </TD>
                ))}
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    );
  }

  // ===== Error state =====
  if (error) {
    return <ErrorState title="Failed to load data" description={error} onRetry={onRetry} />;
  }

  // ===== Empty state =====
  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />;
  }

  // ===== Normal state =====
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            {columns.map((col) => (
              <TH key={col.key} className={col.headerClassName}>
                {col.header}
              </TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {data.map((row) => (
            <TR
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer' : undefined}
            >
              {columns.map((col) => (
                <TD key={col.key} className={col.className}>
                  {col.render ? col.render(row) : row[col.key]}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

/**
 * CustomerCell — avatar + name + secondary text.
 *
 * RTL-aware: In RTL, flexbox automatically reverses, so the avatar appears
 * on the RIGHT (start side in Arabic) and text aligns to the right.
 *
 * Props:
 *   name, initials, secondary, avatarBg
 */
export function CustomerCell({ name, initials, secondary, avatarBg = 'bg-primary' }) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar — appears first (left in LTR, right in RTL due to flex auto-reverse) */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
          avatarBg
        )}
      >
        {initials}
      </div>
      {/* Text — uses text-start (logical) so it aligns left in LTR, right in RTL */}
      <div className="min-w-0 text-start">
        <p className="truncate text-sm font-medium text-gray-900">{name}</p>
        {secondary && <p className="truncate text-xs text-gray-500">{secondary}</p>}
      </div>
    </div>
  );
}

export default DataTable;
