"use client";

import { useCourse } from '@/hooks/useCourse';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChapterData, CourseFormValues } from './types';

export const useCourseSubmission = () => {
  const { createCourse, addChapter: addChapterToBackend, updateCourseImage } = useCourse();
  const router = useRouter();

  const submitCourse = async (
    data: CourseFormValues, 
    chapters: ChapterData[]
  ) => {
    try {
      // Step 1: Create the course with proper backend structure
      const courseData = {
        title: data.title,
        description: data.description,
        price: data.isFree ? 0 : parseFloat(data.price || '0'),
        isFree: data.isFree
      };
      
      const courseResponse = await createCourse(courseData);
      console.log('Course created:', courseResponse);
      
      // Handle different response structures
      const courseId = courseResponse.course?.id || courseResponse.id;
      
      if (!courseId) {
        throw new Error('Course created but no ID returned from server');
      }

      // Step 2: Upload course image if provided
      if (data.courseImage && data.courseImage.length > 0) {
        try {
          const imageFile = data.courseImage[0];
          await updateCourseImage({ id: courseId, value: imageFile });
          console.log('Course image uploaded successfully');
        } catch (imageError) {
          console.warn('Failed to upload course image:', imageError);
        }
      }
      
      // Step 3: Create chapters if any are defined
      if (chapters.length > 0) {
        try {
          for (const chapter of chapters) {
            await addChapterToBackend(courseId, {
              name: chapter.name,
              video: chapter.file || null
            });
          }
          console.log('All chapters created successfully');
        } catch (chapterError) {
          console.warn('Failed to create some chapters:', chapterError);
        }
      }
      
      toast.success('Course created successfully!');
      router.push("/dashboard/courses");
      
      return true;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
      return false;
    }
  };

  return { submitCourse };
};
