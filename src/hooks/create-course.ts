import { useState } from 'react';

interface Course {
  title: string;
}

export const useCreateCourse = () => {
  const [course, setCourse] = useState<Course>({
    title: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCourse = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Replace with your API call logic
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      console.log('Course created successfully:', data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    course,
    isSubmitting,
    error,
    submitCourse,
  };
};