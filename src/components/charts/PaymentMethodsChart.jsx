/**
 * PaymentMethodsChart
 *
 * Reusable donut chart for payment totals.
 * Pass data as: [{ name: 'Cash', value: 240000, color: '#004B46' }].
 */
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

export function PaymentMethodsChart({ data = [] }) {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const locale = isArabic ? 'ar-EG' : 'en-US';
  const currency = isArabic ? 'ج.م' : 'EGP';
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const primaryMethod = data[0];
  const primaryShare = total && primaryMethod ? Math.round((primaryMethod.value / total) * 100) : 0;

  return (
    <section className="card h-full p-4" aria-labelledby="payment-methods-title">
      <h3 id="payment-methods-title" className="text-xl font-bold text-slate-900">
        {isArabic ? 'طرق الدفع' : 'Payment Methods'}
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
        {isArabic ? 'توزيع أنواع المعاملات.' : 'Distribution of transaction types.'}
      </p>

      {/* Smaller donut leaves more horizontal room for payment labels and values. */}
      <div className="mt-5 grid items-center gap-3 sm:grid-cols-[155px_minmax(0,1fr)]">
        <div className="relative h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* The centered label always describes the largest payment method. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">{primaryShare}%</span>
            <span className="text-xs font-medium text-slate-600 uppercase">
              {primaryMethod?.name}
            </span>
          </div>
        </div>

        <ul className="space-y-3">
          {data.map((method) => (
            <li
              key={method.name}
              className="flex items-center justify-between gap-2 text-sm sm:text-base"
            >
              <span className="flex items-center gap-3 font-medium text-slate-800">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                {method.name}
              </span>
              <span className="shrink-0 text-slate-600">
                {currency}{' '}
                {new Intl.NumberFormat(locale, { notation: 'compact' }).format(method.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PaymentMethodsChart;
