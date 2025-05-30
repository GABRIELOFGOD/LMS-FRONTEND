import { Badge } from '@/types/attachment'
import React from 'react';
import Image from 'next/image';

const BadgeCard = ({
  badge
}: {
  badge: Badge;
}) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md">
      <div className="w-[284px] h-[284px] relative rounded-lg overflow-hidden">
        <Image src={badge.image} alt={badge.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{badge.name}</h3>
      </div>
    </div>
  )
}

export default BadgeCard;