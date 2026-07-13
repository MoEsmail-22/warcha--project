import { Link } from 'react-router-dom';
import { CalendarCheck, Car, Wallet, Star, Plus, ChevronRight } from 'lucide-react';
import { useBookings } from '../../contexts/BookingsContext';
import { useVehicles } from '../../contexts/VehiclesContext';
import { useReviews } from '../../contexts/ReviewsContext';
import { useRevenue } from '../../contexts/RevenueContext';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/widgets/StatCard';
import RevenueBarChart from '../../components/charts/RevenueBarChart';

// Status badge colors matching your tailwind config
const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function getGreeting(hour, t) {
  if (hour < 12) return t('greeting.morning', { defaultValue: 'Good morning' });
  if (hour < 17) return t('greeting.afternoon', { defaultValue: 'Good afternoon' });
  if (hour < 21) return t('greeting.evening', { defaultValue: 'Good evening' });
  return t('greeting.night', { defaultValue: 'Good night' });
}

export default function DashboardPage() {
  const { t } = useAppTranslation('dashboard');
  const { user } = useAuth();
  const { todaysBookings, todaysCount, difference } = useBookings();
  const { carsInServiceCount, awaitingApprovalCount } = useVehicles();
  const { avgRating, totalReviews } = useReviews();
  const { weeklyRevenue, todayRevenue, revenueChange, currency } = useRevenue();

  const currentHour = new Date().getHours();
  const greeting = getGreeting(currentHour, t);
  const userName = user?.name || 'Ahmed';

  return (
    <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ============ HEADER: Greeting + New Booking button ============ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl leading-none font-bold tracking-tight text-[#15201F]"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.48px',
              lineHeight: '100%',
            }}
          >
            {greeting}, {userName}
          </h1>
          <p
            className="mt-1.5 text-[#5A6968]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: '100%',
              letterSpacing: '0%',
            }}
          >
            {t('subtitle', {
              defaultValue: "Here's what's happening at your workshop today.",
            })}
          </p>
        </div>

        {/* New Booking button — 126×42px, radius 10px, color #0E5C5B */}
        <button
          className="inline-flex items-center justify-center gap-2 px-4 text-white shadow-sm transition-colors hover:opacity-90"
          style={{
            backgroundColor: '#0E5C5B',
            borderRadius: '10px',
            height: '42px',
            minWidth: '126px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <Plus className="h-4 w-4" />
          {t('newBooking', { defaultValue: 'New booking' })}
        </button>
      </div>

      {/* ============ KPI CARDS (4) ============ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('kpi.todaysBookings', { defaultValue: "Today's bookings" })}
          value={String(todaysCount)}
          change={`+${difference} ${t('vsYesterday', { defaultValue: 'vs yesterday' })}`}
          trend="up"
          icon={<CalendarCheck className="h-5 w-5 text-[#0E5C5B]" />}
          iconBg="bg-teal-50"
          className="bg-red-900"
        />

        <StatCard
          label={t('kpi.carsInService', { defaultValue: 'Cars in service' })}
          value={String(carsInServiceCount)}
          subtext={`${awaitingApprovalCount} ${t('awaitingApproval', { defaultValue: 'awaiting approval' })}`}
          icon={<Car className="h-5 w-5 text-[#0E5C5B]" />}
          iconBg="bg-teal-50"
        />

        <StatCard
          label={t('kpi.revenueToday', { defaultValue: 'Revenue today' })}
          value={`${todayRevenue.toLocaleString()} ${currency}`}
          change={`+${revenueChange}%`}
          trend="up"
          icon={<Wallet className="h-5 w-5 text-[#0E5C5B]" />}
          iconBg="bg-teal-50"
        />

        <StatCard
          label={t('kpi.avgRating', { defaultValue: 'Average rating' })}
          value={String(avgRating)}
          subtext={`${totalReviews} ${t('reviews', { defaultValue: 'reviews' })}`}
          icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* ============ TWO-COLUMN: Schedule + Revenue ============ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ---- Today's Schedule Table ---- (3/5 width ≈ 636px) */}
        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3"
          style={{ borderRadius: '16px' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-lg font-semibold text-[#15201F]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {t('schedule.title', { defaultValue: "Today's Schedule" })}
            </h2>
            <Link
              to="/en/dev/bookings"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0E5C5B] hover:underline"
            >
              {t('schedule.viewAll', { defaultValue: 'View all' })}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-semibold tracking-wide text-[#5A6968] uppercase">
                    {t('schedule.customer', { defaultValue: 'Customer' })}
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold tracking-wide text-[#5A6968] uppercase">
                    {t('schedule.service', { defaultValue: 'Service' })}
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold tracking-wide text-[#5A6968] uppercase">
                    {t('schedule.time', { defaultValue: 'Time' })}
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold tracking-wide text-[#5A6968] uppercase">
                    {t('schedule.status', { defaultValue: 'Status' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {todaysBookings.slice(0, 6).map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0E5C5B]/10 text-xs font-semibold text-[#0E5C5B]">
                          {booking.customer.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#15201F]">
                            {booking.customer}
                          </p>
                          <p className="truncate text-xs text-[#5A6968]">{booking.vehicle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-sm text-[#15201F]">{booking.service}</td>
                    <td className="py-3.5 text-sm font-medium text-[#5A6968]">{booking.time}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          statusStyles[booking.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t(`status.${booking.status}`, {
                          defaultValue: booking.status.replace('_', ' '),
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Revenue This Week Chart ---- (2/5 width ≈ 398px) */}
        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2"
          style={{ borderRadius: '16px' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2
                className="text-lg font-semibold text-[#15201F]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {t('revenue.title', { defaultValue: 'Revenue this week' })}
              </h2>
              <p className="mt-0.5 text-xs text-[#5A6968]">
                {t('revenue.subtitle', { defaultValue: 'Daily earnings overview' })}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="mb-4">
            <p
              className="text-2xl font-bold text-[#15201F]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {weeklyRevenue.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}{' '}
              <span className="text-sm font-medium text-[#5A6968]">{currency}</span>
            </p>
            <p className="mt-0.5 text-xs text-green-600">
              {t('revenue.totalLabel', { defaultValue: 'Total this week' })}
            </p>
          </div>

          <RevenueBarChart data={weeklyRevenue} />
        </div>
      </div>
    </div>
  );
}
