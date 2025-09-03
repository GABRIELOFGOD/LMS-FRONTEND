"use client";

import { Certification } from '@/types/attachment';
import { useEffect, useState } from 'react';
import BadgeCard from './badge-card';
import { certifications } from '@/data/badges';
import { useUser } from '@/context/user-context';

const UserCertification = () => {
  const [userCertifications, setUserCertifications] = useState<Certification[]>([]);
  const { user } = useUser();

  useEffect(() => {
    setUserCertifications(certifications);
  }, []);
  
  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Certifications` : "Certifications"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userCertifications.map((certification) => (
            <BadgeCard key={certification.id} badge={certification} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserCertification