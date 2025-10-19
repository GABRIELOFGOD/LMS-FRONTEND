"use client";

import { Certification } from '@/types/attachment';
import { useEffect, useState } from 'react';
import BadgeCard from './badge-card';
import { useUser } from '@/context/user-context';
import { BASEURL } from '@/lib/utils';
import Link from 'next/link';

const UserCertification = () => {
  const [userCertifications, setUserCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchUserCertifications = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${BASEURL}/users/certifications`, {
        method: "GET",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const certifications = await response.json();
        setUserCertifications(Array.isArray(certifications) ? certifications : []);
      } else {
        console.log('Certifications endpoint not available, showing empty state');
        setUserCertifications([]);
      }
    } catch (error) {
      console.log('Error fetching certifications (endpoint may not exist):', error);
      setUserCertifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCertifications();
  }, [user]);

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
          {user?.fname ? `${user.fname}'s Certifications` : "Certifications"}
        </p>
        <Link 
          href="/learner/certificates"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View All Certificates →
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
            📜
          </div>
          <p>No certifications earned yet</p>
          <p className="text-sm mt-1">Complete courses to earn certificates!</p>
        </div>
      )}
    </div>
  );
};

export default UserCertification;