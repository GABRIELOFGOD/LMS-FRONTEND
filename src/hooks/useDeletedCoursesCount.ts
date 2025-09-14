"use client";

import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { useEffect, useState } from "react";

export const useDeletedCoursesCount = () => {
  const [deletedCount, setDeletedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getDeletedCourses } = useCourse();

  const fetchDeletedCount = async () => {
    try {
      setIsLoading(true);
      const courses = await getDeletedCourses();
      
      if (Array.isArray(courses)) {
        setDeletedCount(courses.length);
      } else {
        setDeletedCount(0);
      }
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to fetch deleted courses count", error.message);
      }
      setDeletedCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCount();
  }, []);

  return { deletedCount, isLoading, refreshCount: fetchDeletedCount };
};
