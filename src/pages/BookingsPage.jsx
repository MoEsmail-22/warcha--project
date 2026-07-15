import { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useBookings } from '../contexts/BookingsContext';
import { useAppTranslation } from '../hooks/useAppTranslation';
import StatusBadge from '../components/widgets/StatusBadge';
import Avatar from '../components/ui/Avatar';
import NewBookingDrawer from '../components/widgets/NewBookingDrawer';
import FilterBookingsDrawer from '../components/widgets/FilterBookingsDrawer';
import BookingDetailsDrawer from '../components/widgets/BookingDetailsDrawer';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const SERVICE_TO_STATUS = {
  'Brake Check': 'Brake Check',
  'Oil Change': 'Oil Change',
  Engine: 'Engine Diagnostic',
  'AC Repair': 'AC Repair',
};

function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function isToday(isoDate) {
  if (!isoDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return isoDate === today;
}

function isThisWeek(isoDate) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (isNaN(date)) return false;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return date >= startOfWeek && date < endOfWeek;
}

function isThisMonth(isoDate) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (isNaN(date)) return false;
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

// Main filter: tab + search + advanced filters
function applyFilters(bookings, { tab, search, advanced }) {
  let result = bookings;

  // ---- Tab filter ----
  if (tab === 'today') result = result.filter((b) => isToday(b.date));
  else if (tab === 'week') result = result.filter((b) => isThisWeek(b.date));
  else if (tab === 'month') result = result.filter((b) => isThisMonth(b.date));

  // ---- Advanced filter: customer name search (from filter panel) ----
  if (advanced?.search?.trim()) {
    const q = advanced.search.toLowerCase();
    result = result.filter((b) => b.customer.name.toLowerCase().includes(q));
  }

  // ---- Advanced filter: service types (checkboxes) ----
  if (advanced?.services?.length > 0) {
    result = result.filter((b) =>
      advanced.services.some((s) => {
        const mapped = SERVICE_TO_STATUS[s] ?? s;
        return b.service.toLowerCase().includes(mapped.toLowerCase());
      })
    );
  }

  // ---- Advanced filter: status ----
  if (advanced?.status) {
    const statusMap = {
      Pending: 'pending',
      Confirmed: 'confirmed',
      'In Progress': 'in_progress',
      Completed: 'completed',
    };
    const targetStatus = statusMap[advanced.status] ?? advanced.status.toLowerCase();
    result = result.filter((b) => b.status === targetStatus);
  }

  // ---- Advanced filter: date range ----
  if (advanced?.dateFrom) {
    result = result.filter((b) => b.date >= advanced.dateFrom);
  }
  if (advanced?.dateTo) {
    result = result.filter((b) => b.date <= advanced.dateTo);
  }

  // ---- Top search bar (separate from advanced filter search) ----
  if (search?.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customer.name.toLowerCase().includes(q) ||
        b.vehicle.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.technician.name.toLowerCase().includes(q)
    );
  }

  return result;
}

export default function BookingsPage() {
  const { t } = useAppTranslation('bookings');
  const { bookings, addBooking, updateBookingStatus } = useBookings();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const pageSize = 8;

  // ---- Drawer state ----
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filtered = useMemo(
    () => applyFilters(bookings, { tab: activeTab, search, advanced: advancedFilters }),
    [bookings, activeTab, search, advancedFilters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((currentPageSafe - 1) * pageSize, currentPageSafe * pageSize);

  // ---- Handlers (NOW ACTUALLY MUTATE STATE) ----
  const handleCreateBooking = (formData) => {
    addBooking(formData); // adds to context state → table updates instantly
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setAdvancedFilters(null);
    setCurrentPage(1);
  };

  const handleAccept = (booking) => {
    updateBookingStatus(booking.id, 'confirmed');
    setSelectedBooking(null);
  };

  const handleDecline = (booking) => {
    updateBookingStatus(booking.id, 'cancelled');
    setSelectedBooking(null);
  };

  // Keep selectedBooking in sync after status change (so drawer shows updated timeline)
  const selectedBookingLive = selectedBooking
    ? (bookings.find((b) => b.id === selectedBooking.id) ?? null)
    : null;

  // Check if advanced filters are active
  const hasActiveFilters =
    !!advancedFilters &&
    (advancedFilters.search?.trim() ||
      advancedFilters.services?.length > 0 ||
      advancedFilters.status ||
      advancedFilters.dateFrom ||
      advancedFilters.dateTo);

  return (
    <div className="flex h-full flex-col">
      {/* ============ HEADER ============ */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#15201F]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {t('title', { defaultValue: 'Bookings' })}
          </h1>
          <p className="mt-1 text-sm text-[#5A6968]">
            {t('subtitle', { defaultValue: 'Manage and schedule incoming service requests.' })}
          </p>
        </div>

        <button
          onClick={() => setNewBookingOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0E5C5B', height: '40px', fontWeight: 600, fontSize: '14px' }}
        >
          <Plus className="h-4 w-4" />
          {t('newBooking', { defaultValue: 'New booking' })}
        </button>
      </div>

      {/* ============ FILTERS + SEARCH ============ */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'border-[#0E5C5B] bg-[#0E5C5B] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t(`tabs.${tab.key}`, { defaultValue: tab.label })}
            </button>
          ))}

          <button
            onClick={() => setFilterOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              hasActiveFilters
                ? 'border-[#0E5C5B] bg-teal-50 text-[#0E5C5B]'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t('filters', { defaultValue: 'Filters' })}
            {hasActiveFilters && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0E5C5B] px-1 text-[10px] font-bold text-white">
                ●
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t('search', { defaultValue: 'Search bookings...' })}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
          />
        </div>
      </div>

      {/* ============ TABLE ============ */}
      <div
        className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        style={{ borderRadius: '16px' }}
      >
        <div className="h-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                {[
                  'Booking ID',
                  'Customer',
                  'Vehicle',
                  'Service',
                  'Technician',
                  'Date/Time',
                  'Status',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    className={`px-4 py-3 text-xs font-semibold tracking-wide text-[#5A6968] uppercase ${
                      header === 'Actions' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">
                    {t('noResults', { defaultValue: 'No bookings found.' })}
                  </td>
                </tr>
              ) : (
                paginated.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3.5 text-sm font-medium text-[#5A6968]">
                      #{booking.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          initials={booking.customer.initials}
                          name={booking.customer.name}
                          color={booking.customer.avatarColor}
                          size={32}
                        />
                        <span className="text-sm font-medium text-[#15201F]">
                          {booking.customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#15201F]">{booking.vehicle}</td>
                    <td className="px-4 py-3.5 text-sm text-[#15201F]">{booking.service}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          initials={booking.technician.initials}
                          name={booking.technician.name}
                          color={booking.technician.avatarColor}
                          size={32}
                        />
                        <span className="text-sm font-medium text-[#15201F]">
                          {booking.technician.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#15201F]">
                      <div>
                        <p>{formatDate(booking.date)}</p>
                        <p className="text-xs text-[#5A6968]">{booking.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="View details"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ============ PAGINATION ============ */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-[#5A6968]">
            {t('showing', { defaultValue: 'Showing' })}{' '}
            <span className="font-semibold text-[#15201F]">
              {filtered.length === 0 ? 0 : (currentPageSafe - 1) * pageSize + 1}–
              {Math.min(currentPageSafe * pageSize, filtered.length)}
            </span>{' '}
            {t('of', { defaultValue: 'of' })}{' '}
            <span className="font-semibold text-[#15201F]">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPageSafe === 1}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                  currentPageSafe === page
                    ? 'bg-[#0E5C5B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPageSafe === totalPages}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============ DRAWERS ============ */}
      <NewBookingDrawer
        open={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        onCreate={handleCreateBooking}
      />
      <FilterBookingsDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />
      <BookingDetailsDrawer
        open={!!selectedBookingLive}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBookingLive}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
}
