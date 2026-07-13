/**
 * MiniTrend — inline trend indicator with up/down arrow.
 *
 * TWO MODES:
 * 1. Auto-calc mode: pass current + previous, auto-calculates the change
 * 2. Manual mode: pass value string directly (e.g. "+12%", "-2.1%", "0%")
 *
 * Bilingual: uses i18next with the 'common' namespace.
 * If the numeric value is 0, shows neutral (gray, dash icon) — NOT down.
 */
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/utils/cn';

const TREND_CONFIG = {
  up: {
    color: 'text-status-completed',
    Icon: ArrowUp,
  },
  down: {
    color: 'text-status-cancelled',
    Icon: ArrowDown,
  },
  neutral: {
    color: 'text-gray-500',
    Icon: Minus,
  },
};

function formatNumber(value, isArabic) {
  const locale = isArabic ? 'ar-EG' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Extract the numeric value from a string like "+12%", "-2.1%", "0%", "14"
 * Returns null if no number found.
 */
function parseNumericValue(str) {
  if (typeof str !== 'string') return null;
  // Match optional sign + number (including decimals)
  const match = str.match(/-?\d+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
}

export function MiniTrend({
  current,
  previous,
  mode = 'absolute',
  labelKey,
  value,
  trend: manualTrend,
  showArrow = true,
  className,
}) {
  const { t, i18n } = useAppTranslation('common');
  const isArabic = i18n.language?.startsWith('ar');

  // ===== MANUAL MODE =====
  if (value !== undefined) {
    // Parse the numeric value from the string to determine the trend
    const numValue = parseNumericValue(String(value));
    let computedTrend = manualTrend;

    // If no manual trend passed, compute from the value
    if (!computedTrend && numValue !== null) {
      if (numValue > 0) computedTrend = 'up';
      else if (numValue < 0) computedTrend = 'down';
      else computedTrend = 'neutral'; // 0 = neutral
    }

    const config = TREND_CONFIG[computedTrend || 'neutral'] || TREND_CONFIG.neutral;
    const { Icon } = config;

    let displayValue = value;
    if (labelKey) {
      const label = t(`trends.${labelKey}`, { defaultValue: '' });
      if (label) displayValue = `${value} ${label}`;
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs font-medium',
          config.color,
          className
        )}
      >
        {showArrow && <Icon size={12} strokeWidth={2.5} />}
        {displayValue}
      </span>
    );
  }

  // ===== AUTO-CALC MODE =====
  const diff = current - previous;
  // 0 = neutral, NOT down
  const autoTrend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
  const config = TREND_CONFIG[autoTrend];
  const { Icon } = config;

  let changeText;
  if (mode === 'percentage') {
    if (previous === 0) {
      changeText = `${diff > 0 ? '+' : ''}${formatNumber(diff, isArabic)}`;
    } else {
      const pct = (diff / previous) * 100;
      const formatted = pct.toLocaleString(isArabic ? 'ar-EG' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      // Only show + sign if positive; 0 shows no sign
      changeText = `${diff > 0 ? '+' : ''}${formatted}%`;
    }
  } else {
    changeText = `${diff > 0 ? '+' : ''}${formatNumber(diff, isArabic)}`;
  }

  const label = labelKey ? t(`trends.${labelKey}`, { defaultValue: '' }) : '';
  const fullText = label ? `${changeText} ${label}` : changeText;

  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium', config.color, className)}
    >
      {showArrow && <Icon size={12} strokeWidth={2.5} />}
      {fullText}
    </span>
  );
}

export default MiniTrend;
