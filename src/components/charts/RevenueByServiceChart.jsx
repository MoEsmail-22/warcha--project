/**
 * RevenueByServiceChart
 *
 * Reusable progress-bar chart for a service revenue breakdown.
 * Pass data as: [{ name: 'Oil & Filter', revenue: 82000 }].
 */
import { useLanguage } from '@/contexts/LanguageContext';

export function RevenueByServiceChart({ data = [] }) {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);
  const currency = isArabic ? 'ج.م' : 'EGP';
  const locale = isArabic ? 'ar-EG' : 'en-US';

  return (
    <section className="card h-full p-5" aria-labelledby="revenue-by-service-title">
      <h3 id="revenue-by-service-title" className="mb-6 text-xl font-bold text-slate-900">
        {isArabic ? 'الإيراد حسب الخدمة' : 'Revenue by Service'}
      </h3>

      <div className="space-y-5">
        {data.map((service) => {
          const percentage = Math.round((service.revenue / maxRevenue) * 100);
          return (
            <div key={service.name}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm sm:text-base">
                <span className="font-medium text-slate-800">{service.name}</span>
                <span className="shrink-0 font-medium text-slate-600">
                  {currency}{' '}
                  {new Intl.NumberFormat(locale, { notation: 'compact' }).format(service.revenue)}
                </span>
              </div>
              {/* Width is relative to the best-performing service in this report. */}
              <div className="h-2.5 overflow-hidden rounded-full bg-[#E4EDFC]">
                <div
                  className="h-full rounded-full bg-[#004B46] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                  aria-label={`${service.name}: ${percentage}% of the largest service revenue`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RevenueByServiceChart;
