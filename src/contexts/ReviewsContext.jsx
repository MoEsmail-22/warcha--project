import { createContext, useContext, useState } from 'react';

const ReviewsContext = createContext(null);

const mockReviews = [
  { id: 1, customer: 'Ahmed Ali', rating: 5, comment: 'Great service!' },
  { id: 2, customer: 'Mohamed Salah', rating: 4, comment: 'Fast and professional.' },
  { id: 3, customer: 'Sara Hassan', rating: 5, comment: 'Very happy with the repair.' },
  { id: 4, customer: 'Omar Yasser', rating: 4, comment: 'Good communication.' },
];

export function ReviewsProvider({ children }) {
  const [reviews] = useState(mockReviews);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews === 0
      ? 0
      : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10;

  const value = {
    reviews,
    avgRating,
    totalReviews,
  };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used inside a <ReviewsProvider>');
  return ctx;
}
