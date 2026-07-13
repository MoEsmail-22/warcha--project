/**
 * RatingStars — display-only star rating with partial fill support.
 *
 * RTL-aware: In Arabic, the numeric rating appears on the LEFT (start side
 * in RTL) and stars flow from right to left.
 *
 * Props:
 *   rating     → number 0–5 (supports decimals: 4.8, 3.5, etc.)
 *   size       → 'sm' | 'md' | 'lg'  (default 'md')
 *   showNumber → if true, shows the numeric rating next to the stars
 */
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SIZES = {
  sm: 14,
  md: 16,
  lg: 20,
};

export function RatingStars({ rating = 0, size = 'md', showNumber = false }) {
  const { isRTL } = useLanguage();
  const px = SIZES[size];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const roundedUp = rating - full >= 0.75;
  const totalFullStars = full + (roundedUp ? 1 : 0);
  const total = 5;

  const stars = (
    <div className="flex items-center">
      {Array.from({ length: total }).map((_, i) => {
        const isFull = i < totalFullStars;
        const isHalf = i === totalFullStars && hasHalf;

        return (
          <div key={i} className="relative" style={{ width: px, height: px }}>
            <Star size={px} className="absolute inset-0 text-gray-300" fill="currentColor" />
            {(isFull || isHalf) && (
              <Star
                size={px}
                className="text-accent absolute inset-0"
                fill="currentColor"
                style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const number = showNumber && (
    <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
  );

  // In LTR: stars then number (left to right)
  // In RTL: number then stars (right to left, so number appears on the right/start)
  // Using flex-row-reverse in RTL makes the number appear on the start side
  return (
    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {stars}
      {number}
    </div>
  );
}

export default RatingStars;
