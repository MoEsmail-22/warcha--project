import {
  Download,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
  Calendar,
  Activity,
  Percent,
  Award,
} from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useRevenue } from '@/contexts';
import { Button } from '@/components/ui';
import { StatCard, MiniTrend, ErrorState, SkeletonCard } from '@/components/widgets';
import { RevenueComparisonChart } from '@/components/charts';

export default function RevenuePage() {
  const { t, i18n } = useAppTranslation('revenue');
  const { data: revenue, loading, error } = useRevenue();

  const isArabic = i18n.language?.startsWith('ar');
  const locale = isArabic ? 'ar-EG' : 'en-US';
  const currency = isArabic ? 'ج.م' : 'EGP';

  const formatEGP = (value) => {
    const formatted = new Intl.NumberFormat(locale).format(value);
    return `${currency} ${formatted}`;
  };

  const formatNumber = (value) => new Intl.NumberFormat(locale).format(value);

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="space-y-6">
        <RevenueHeader t={t} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard className="h-32" rounded="lg" />
          <SkeletonCard className="h-32" rounded="lg" />
          <SkeletonCard className="h-32" rounded="lg" />
          <SkeletonCard className="h-32" rounded="lg" />
        </div>
        <SkeletonCard className="h-96" rounded="lg" />
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="space-y-6">
        <RevenueHeader t={t} />
        <ErrorState title="Failed to load revenue data" description={error} />
      </div>
    );
  }

  // ===== SUCCESS STATE =====
  const { summary, comparison, weeklyChart, quickSummary } = revenue;

  // Helper: format a percentage with sign (+/-), no sign for 0
  const formatPercent = (val) => `${val > 0 ? '+' : ''}${val}%`;

  // Helper: determine trend direction from a number
  // 0 = neutral (NOT down)
  const trendOf = (val) => (val > 0 ? 'up' : val < 0 ? 'down' : 'neutral');

  return (
    <div className="space-y-6">
      {/* ===== PAGE HEADER ===== */}
      <RevenueHeader t={t} />

      {/* ===== 4 METRIC CARDS ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Today's Revenue */}
        <StatCard
          icon={<DollarSign size={20} />}
          value={formatEGP(summary.today)}
          label={t('metrics.todayRevenue')}
          subtext={
            <MiniTrend value={formatPercent(comparison.todayChange)} labelKey="vsYesterday" />
          }
          trend={trendOf(comparison.todayChange)}
        />

        {/* 2. Monthly Revenue */}
        <StatCard
          icon={<TrendingUp size={20} />}
          value={formatEGP(summary.month)}
          label={t('metrics.monthlyRevenue')}
          subtext={
            <MiniTrend value={formatPercent(comparison.monthChange)} labelKey="vsLastMonth" />
          }
          trend={trendOf(comparison.monthChange)}
        />

        {/* 3. Avg Order Value */}
        <StatCard
          icon={<Wallet size={20} />}
          value={formatEGP(summary.avgOrderValue)}
          label={t('metrics.avgOrderValue')}
          subtext={
            <MiniTrend value={formatPercent(comparison.avgOrderChange)} labelKey="vsLastWeek" />
          }
          trend={trendOf(comparison.avgOrderChange)}
        />

        {/* 4. Outstanding */}
        <StatCard
          icon={<AlertCircle size={20} />}
          value={formatEGP(summary.outstanding)}
          label={t('metrics.outstanding')}
          subtext={
            <MiniTrend value={summary.outstandingInvoices} labelKey="invoices" showArrow={false} />
          }
          trend="neutral"
          iconBg="bg-status-pending/10"
        />
      </div>

      {/* ===== MAIN CHART (2/3) + QUICK SUMMARY (1/3) ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Revenue Comparison Chart */}
        <div className="lg:col-span-2">
          <RevenueComparisonChart data={weeklyChart} />
        </div>

        {/* Right: Quick Summary sidebar */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('quickSummary.title')}
            </h3>

            <ul className="space-y-4">
              {/* Highest Revenue Day */}
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quickSummary.highestRevenueDay')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quickSummary.highestRevenueDay.day} ·{' '}
                    {formatEGP(quickSummary.highestRevenueDay.amount)}
                  </p>
                </div>
              </li>

              {/* Avg Daily Revenue */}
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quickSummary.avgDailyRevenue')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatEGP(quickSummary.avgDailyRevenue)}
                  </p>
                </div>
              </li>

              {/* Profit Margin */}
              <li className="flex items-start gap-3">
                <div className="bg-primary-50 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quickSummary.profitMargin')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatNumber(summary.profitMargin)}%
                  </p>
                </div>
              </li>

              {/* Top Selling Service */}
              <li className="flex items-start gap-3">
                <div className="bg-accent/10 text-accent-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quickSummary.topSellingService')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {quickSummary.topSellingService.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatEGP(quickSummary.topSellingService.revenue)} ·{' '}
                    {formatNumber(quickSummary.topSellingService.count)}{' '}
                    {isArabic ? 'طلب' : 'orders'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RevenueHeader — page header with title + Export button + date dropdown.
 */
function RevenueHeader({ t }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            className="focus:border-primary focus:ring-primary h-10 appearance-none rounded-lg border border-gray-300 bg-white ps-4 pe-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-1 focus:outline-none"
            defaultValue="last30"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        <Button variant="primary">
          <Download size={16} />
          {t('exportReport')}
        </Button>
      </div>
    </div>
  );
}
