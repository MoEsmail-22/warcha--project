/**
 * RevenueComparisonChart — daily revenue bars comparing current vs previous month.
 *
 * Phase 5 chart: two series (Current Month dark teal / Previous Month light gray)
 * with legend, custom tooltip (EGP), RTL-aware, bilingual.
 *
 * Props:
 *   data → array of { day, current, previous }
 */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const COLORS = {
  current: '#0D4D47',
  previous: '#D1D5DB',
  grid: '#F3F4F6',
  axis: '#9CA3AF',
};

function CustomTooltip({ active, payload, label, isArabic }) {
  if (!active || !payload || !payload.length) return null;
  const locale = isArabic ? 'ar-EG' : 'en-US';
  const currency = isArabic ? 'ج.م' : 'EGP';

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-gray-900">{label}</p>
      {payload.map((entry) => {
        const formatted = new Intl.NumberFormat(locale).format(entry.value);
        const labelKey = entry.dataKey === 'current' ? 'currentMonth' : 'previousMonth';
        return (
          <p key={entry.dataKey} className="text-xs font-medium" style={{ color: entry.color }}>
            {isArabic
              ? labelKey === 'currentMonth'
                ? 'الشهر الحالي'
                : 'الشهر الماضي'
              : labelKey === 'currentMonth'
                ? 'Current Month'
                : 'Previous Month'}
            : {currency} {formatted}
          </p>
        );
      })}
    </div>
  );
}

function formatYAxis(value, isArabic) {
  const locale = isArabic ? 'ar-EG' : 'en-US';
  if (value >= 1000) {
    const kValue = value / 1000;
    const formatted = kValue.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return isArabic ? `${formatted}ك` : `${formatted}k`;
  }
  return new Intl.NumberFormat(locale).format(Math.round(value));
}

export function RevenueComparisonChart({ data = [] }) {
  const { isRTL } = useLanguage();
  // Detect Arabic from the <html> lang attribute
  const isArabic = typeof document !== 'undefined' && document.documentElement.lang === 'ar';

  return (
    <div className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {isArabic ? 'مقارنة الإيرادات' : 'Revenue Comparison'}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barGap={2}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: COLORS.axis }}
            axisLine={false}
            tickLine={false}
            reversed={isRTL}
          />
          <YAxis
            tickFormatter={(v) => formatYAxis(v, isArabic)}
            tick={{ fontSize: 11, fill: COLORS.axis }}
            axisLine={false}
            tickLine={false}
            width={45}
            orientation={isRTL ? 'right' : 'left'}
          />
          <Tooltip
            content={<CustomTooltip isArabic={isArabic} />}
            cursor={{ fill: 'rgba(13, 77, 71, 0.05)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            formatter={(value) => {
              if (value === 'current') {
                return isArabic ? 'الشهر الحالي' : 'Current Month';
              }
              return isArabic ? 'الشهر الماضي' : 'Previous Month';
            }}
          />
          <Bar
            dataKey="current"
            fill={COLORS.current}
            radius={[4, 4, 0, 0]}
            maxBarSize={20}
            animationDuration={600}
          />
          <Bar
            dataKey="previous"
            fill={COLORS.previous}
            radius={[4, 4, 0, 0]}
            maxBarSize={20}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueComparisonChart;
