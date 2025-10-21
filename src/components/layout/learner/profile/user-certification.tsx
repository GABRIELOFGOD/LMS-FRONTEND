"use client";

import { Certification } from '@/types/attachment';
import { useState } from 'react';
import BadgeCard from './badge-card';
import { useUser } from '@/context/user-context';
import Link from 'next/link';

const UserCertification = () => {
  const [userCertifications] = useState<Certification[]>([]);
  const [isLoading] = useState(false);
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Certifications</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Badges & Achievements` : "Badges & Achievements"}
        </p>
        <Link 
          href="/learner/certificates"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View All Achievements →
        </Link>
      </div>
      
      {userCertifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userCertifications.map((certification) => (
            <BadgeCard key={certification.id} badge={certification} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            🏅
          </div>
          <p>No badges earned yet</p>
          <p className="text-sm mt-1">Complete courses to earn badges!</p>
        </div>
      )}

      <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            📜
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">About Achievements</h4>
            <p className="text-xs text-muted-foreground">
              Earn a badge for each course you complete. Complete all enrolled courses to unlock your Master Certificate!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCertification;