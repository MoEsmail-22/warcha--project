import {
  Download,
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useRevenue } from '@/contexts';
import { aggregateRevenue } from '@/contexts/RevenueContext';
import { Button, Input, Modal, Select } from '@/components/ui';
import { StatCard, MiniTrend, ErrorState, SkeletonCard } from '@/components/widgets';
import {
  PaymentMethodsChart,
  RevenueByServiceChart,
  RevenueComparisonChart,
} from '@/components/charts';

export default function RevenuePage() {
  const { t, i18n } = useAppTranslation('revenue');
  const { records, minDate, maxDate, loading, error } = useRevenue();
  const [rangeType, setRangeType] = useState('last7');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeRange, setActiveRange] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState('');
  const [draftEndDate, setDraftEndDate] = useState('');
  const [dateModalError, setDateModalError] = useState('');
  // The summary starts collapsed only on mobile to preserve chart space.
  const [isQuickSummaryOpen, setIsQuickSummaryOpen] = useState(false);

  const isArabic = i18n.language?.startsWith('ar');
  const locale = isArabic ? 'ar-EG' : 'en-US';
  const currency = isArabic ? 'ج.م' : 'EGP';

  // Use the newest mock/API date as "today" so presets remain stable over time.
  useEffect(() => {
    if (!maxDate) return;
    const range = makePresetRange(7, minDate, maxDate);
    setStartDate(range.start);
    setEndDate(range.end);
    setDraftStartDate(range.start);
    setDraftEndDate(range.end);
    setActiveRange(range);
  }, [minDate, maxDate]);

  const revenue = useMemo(() => {
    if (!records.length || !activeRange) return null;
    const selected = records.filter(
      (record) => record.date >= activeRange.start && record.date <= activeRange.end
    );
    const selectedStartIndex = records.findIndex((record) => record.date === selected[0]?.date);
    const previous = records.slice(
      Math.max(0, selectedStartIndex - selected.length),
      selectedStartIndex
    );
    const granularity =
      selected.length === 90 ? 'monthly' : selected.length > 31 ? 'weekly' : 'daily';
    return aggregateRevenue(selected, previous, { granularity });
  }, [records, activeRange]);

  const handleRangeTypeChange = (event) => {
    const nextType = event.target.value;
    setRangeType(nextType);
    if (nextType === 'custom') {
      // Draft values let the modal show validation without changing the report
      // until the user explicitly applies a valid date range.
      setDraftStartDate(startDate);
      setDraftEndDate(endDate);
      setDateModalError('');
      setIsDateModalOpen(true);
      return;
    }

    const days = Number(nextType.replace('last', ''));
    const range = makePresetRange(days, minDate, maxDate);
    setStartDate(range.start);
    setEndDate(range.end);
    setActiveRange(range);
  };

  const applyCustomRange = () => {
    const validationError = validateRange(draftStartDate, draftEndDate, minDate, maxDate);
    setDateModalError(validationError);
    if (validationError) return;

    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setActiveRange({ start: draftStartDate, end: draftEndDate });
    setIsDateModalOpen(false);
  };

  /** Download exactly the records represented by the current report as CSV. */
  const exportReport = () => {
    if (!activeRange) return;
    const selected = records.filter(
      (record) => record.date >= activeRange.start && record.date <= activeRange.end
    );
    const header = 'Date,Bookings,Completed Jobs,Income,Expenses,Profit';
    const rows = selected.map((record) =>
      [
        record.date,
        record.bookings,
        record.completedJobs,
        record.income,
        record.expenses,
        record.profit,
      ].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revenue-${activeRange.start}-to-${activeRange.end}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
  if (!revenue) return null;

  const { summary, comparison, weeklyChart, quickSummary, breakdowns } = revenue;

  // Helper: format a percentage with sign (+/-), no sign for 0
  const formatPercent = (val) => `${val > 0 ? '+' : ''}${val}%`;

  // Helper: determine trend direction from a number
  // 0 = neutral (NOT down)
  const trendOf = (val) => (val > 0 ? 'up' : val < 0 ? 'down' : 'neutral');

  return (
    <div className="space-y-6">
      {/* ===== PAGE HEADER ===== */}
      <RevenueHeader
        t={t}
        rangeType={rangeType}
        onRangeTypeChange={handleRangeTypeChange}
        onExport={exportReport}
      />

      <DateRangeModal
        open={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        startDate={draftStartDate}
        endDate={draftEndDate}
        onStartDateChange={(event) => {
          setDraftStartDate(event.target.value);
          setDateModalError('');
        }}
        onEndDateChange={(event) => {
          setDraftEndDate(event.target.value);
          setDateModalError('');
        }}
        minDate={minDate}
        maxDate={maxDate}
        error={dateModalError}
        onApply={applyCustomRange}
      />

      {/* ===== 4 METRIC CARDS ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Today's Revenue */}
        <StatCard
          icon={<DollarSign size={20} />}
          value={formatEGP(summary.today)}
          label={isArabic ? 'إيراد تاريخ النهاية' : 'End-date revenue'}
          subtext={
            <MiniTrend value={formatPercent(comparison.todayChange)} labelKey="vsYesterday" />
          }
          trend={trendOf(comparison.todayChange)}
        />

        {/* 2. Monthly Revenue */}
        <StatCard
          icon={<TrendingUp size={20} />}
          value={formatEGP(summary.month)}
          label={isArabic ? 'إيراد الفترة المحددة' : 'Selected period revenue'}
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
      <div className="mb-0 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Revenue Comparison Chart */}
        <div className="lg:col-span-2">
          <RevenueComparisonChart data={weeklyChart} />
        </div>

        {/* Right: compact insight card styled after the provided Quick Summary design. */}
        <div className="relative order-first min-h-0 overflow-hidden rounded-2xl bg-[#004B46] p-5 text-white shadow-sm lg:order-none lg:min-h-[320px] lg:p-8">
          {/* Decorative icons are visual-only and never cover the report text. */}
          <Sparkles
            aria-hidden="true"
            className="absolute -end-9 -bottom-10 hidden h-44 w-44 text-teal-300 opacity-15 lg:block"
            strokeWidth={1.2}
          />
          <div className="relative z-10">
            {/* On mobile this is an accordion header; desktop details always remain visible. */}
            <button
              type="button"
              className="flex w-full items-center justify-between text-start lg:pointer-events-none"
              onClick={() => setIsQuickSummaryOpen((isOpen) => !isOpen)}
              aria-expanded={isQuickSummaryOpen}
              aria-controls="quick-summary-details"
            >
              <h3 className="text-xl font-bold text-white lg:text-2xl">
                {t('quickSummary.title')}
              </h3>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 transition-transform lg:hidden ${
                  isQuickSummaryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              id="quick-summary-details"
              className={`${isQuickSummaryOpen ? 'mt-7 block' : 'hidden'} space-y-6 lg:mt-9 lg:block`}
            >
              <section>
                <p className="text-xs font-bold tracking-wider text-teal-200 uppercase">
                  {t('quickSummary.highestRevenueDay')}
                </p>
                <p className="mt-2 text-xl font-bold">{quickSummary.highestRevenueDay.day}</p>
                <p className="mt-1 text-sm font-medium text-teal-100">
                  {formatEGP(quickSummary.highestRevenueDay.amount)}{' '}
                  {isArabic ? 'تم تحصيلها' : 'collected'}
                </p>
              </section>

              <section className="border-t border-white/15 pt-6">
                <p className="text-xs font-bold tracking-wider text-teal-200 uppercase">
                  {t('quickSummary.avgDailyRevenue')}
                </p>
                <p className="mt-2 text-xl font-bold">{formatEGP(quickSummary.avgDailyRevenue)}</p>
                <p className="mt-1 text-sm font-medium text-teal-100">
                  {formatPercent(comparison.monthChange)}{' '}
                  {isArabic ? 'مقارنة بالفترة السابقة' : 'vs previous period'}
                </p>
              </section>

              <section className="border-t border-white/15 pt-6">
                <p className="text-xs font-bold tracking-wider text-teal-200 uppercase">
                  {t('quickSummary.profitMargin')}
                </p>
                <p className="mt-2 text-xl font-bold">{formatNumber(summary.profitMargin)}%</p>
                <p className="mt-1 text-sm font-medium text-teal-100">
                  {formatPercent(comparison.avgOrderChange)}{' '}
                  {isArabic ? 'عن الفترة السابقة' : 'from previous period'}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/*
          This parent spans the same two grid columns as RevenueComparisonChart.
          `flex-col` is the mobile layout; at md (768px+) the cards become a row.
        */}
        <div className="mt-0 flex flex-col gap-2.5 md:flex-row lg:col-span-2">
          <div className="min-w-0 flex-1">
            <RevenueByServiceChart data={breakdowns.serviceRevenue} />
          </div>
          <div className="min-w-0 flex-1">
            <PaymentMethodsChart data={breakdowns.paymentMethods} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RevenueHeader — page header with title + Export button + date dropdown.
 */
function RevenueHeader({ t, rangeType = 'last7', onRangeTypeChange, onExport }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
        <div className="w-full sm:w-44">
          <Select
            id="revenue-range"
            aria-label="Revenue report range"
            value={rangeType}
            onChange={onRangeTypeChange}
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="custom">Custom range</option>
          </Select>
        </div>

        <Button variant="primary" onClick={onExport}>
          <Download size={16} />
          {t('exportReport')}
        </Button>
      </div>
    </div>
  );
}

function DateRangeModal({
  open,
  onClose,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  error,
  onApply,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose a custom date range"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onApply}>
            Apply range
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-500">
        Select up to 90 days. The report updates only after you apply a valid range.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="revenue-start-date"
          type="date"
          label="From"
          min={minDate}
          max={maxDate}
          value={startDate}
          onChange={onStartDateChange}
          error={Boolean(error)}
        />
        <Input
          id="revenue-end-date"
          type="date"
          label="To"
          min={minDate}
          max={maxDate}
          value={endDate}
          onChange={onEndDateChange}
          error={Boolean(error)}
        />
      </div>
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

function makePresetRange(days, minDate, maxDate) {
  const end = new Date(`${maxDate}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - days + 1);
  return { start: toInputDate(start) < minDate ? minDate : toInputDate(start), end: maxDate };
}

const toInputDate = (date) => date.toISOString().slice(0, 10);

/** Validate availability, ordering, and the inclusive 90-day safety limit. */
function validateRange(start, end, minDate, maxDate) {
  if (!start || !end) return 'Please select both a start date and an end date.';
  if (start < minDate || end > maxDate) {
    return `Date must be between ${minDate} and ${maxDate}.`;
  }
  if (start > end) return 'The start date must be before the end date.';
  const inclusiveDays =
    Math.round((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / DAY_MS) + 1;
  if (inclusiveDays > 90) return 'The selected range cannot be longer than 90 days.';
  return '';
}
