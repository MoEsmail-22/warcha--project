/**
 * ProPlanCard — sidebar footer card.
 */
import { Star } from 'lucide-react';

export function ProPlanCard() {
  return (
    <div className="rounded-lg bg-white/5 p-4 text-white">
      <div className="flex items-center gap-2">
        <Star size={16} className="text-accent" fill="currentColor" />
        <span className="text-sm font-semibold">Pro Plan</span>
      </div>
      <p className="mt-1 text-xs text-gray-300">Renews Jun 2026 · 12 jobs left today</p>
    </div>
  );
}

export default ProPlanCard;
