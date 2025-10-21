import { Badge } from '@/types/attachment'
import React from 'react';
import CourseBadge from '@/components/learner/course-badge';

const BadgeCard = ({
  badge
}: {
  badge: Badge;
}) => {
  // Determine badge variant based on badge name/id
  const getVariant = (badgeId: string) => {
    const variants = ['blue', 'green', 'purple', 'gold'] as const;
    const index = parseInt(badgeId.replace(/\D/g, '')) || 0;
    return variants[index % variants.length];
  };

  // Extract course title from badge name (removes "Completed: " prefix if present)
  const getCourseTitle = (name: string) => {
    return name.replace(/^Completed:\s*/i, '');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-4">
      <div className="flex justify-center mb-4">
        <CourseBadge 
          courseTitle={getCourseTitle(badge.name)}
          size="md"
          variant={getVariant(badge.id || '0')}
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{badge.name}</h3>
        {badge.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {badge.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default BadgeCard;