'use client';

import { Star, StarHalf } from 'lucide-react';

const MAX_STARS = 5;

const Rating = ({
  rate,
  total,
}: {
  rate: number;
  total: number;
}) => {
  const normalized = (rate / total) * MAX_STARS;
  const fullStars = Math.floor(normalized);
  const hasHalfStar = normalized - fullStars >= 0.5;
  const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star size={10} key={`full-${i}`} className="text-primary w-5 h-5" fill="currentColor" />
      ))}
      {hasHalfStar && (
        <StarHalf size={10} className="text-primary w-5 h-5" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star size={10} key={`empty-${i}`} className="text-gray-300 w-5 h-5" />
      ))}
    </div>
  );
};

export default Rating;
