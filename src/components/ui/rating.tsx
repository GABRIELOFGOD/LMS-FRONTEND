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
        <Star size={15} key={`full-${i}`} className="text-secondary" fill="currentColor" />
      ))}
      {hasHalfStar && (
        <StarHalf size={15} className="text-secondary" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star size={15} key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

export default Rating;
