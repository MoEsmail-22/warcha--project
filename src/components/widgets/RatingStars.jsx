/**
 * RatingStars — display-only star rating with partial fill support.
 */
import { Star } from 'lucide-react';

const SIZES = {
  sm: 14,
  md: 16,
  lg: 20,
};

export function RatingStars({ rating = 0, size = 'md', showNumber = false }) {
  const px = SIZES[size];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const roundedUp = rating - full >= 0.75;
  const totalFullStars = full + (roundedUp ? 1 : 0);
  const total = 5;

  return (
    <div className="flex items-center gap-1">
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
      {showNumber && <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>}
    </div>
  );
}

export default RatingStars;
