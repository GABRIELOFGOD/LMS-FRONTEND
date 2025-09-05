"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useCourse } from '@/hooks/useCourse';
import { useRouter } from 'next/navigation';

// Import our new components
import { CourseBasicInfo } from './course-basic-info';
import { CoursePricing } from './course-pricing';
import { CourseImageUpload } from './course-image-upload';
import { ChapterManagement, ChapterData } from './chapter-management';

// Zod schema for form validation
const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      'Price must be a valid number greater than or equal to 0'
    ),
  isFree: z.boolean().default(true),
  courseImage: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || file.length === 0) return true; // Optional file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return validTypes.includes(file[0]?.type);
      },
      'Please upload a valid image file (JPEG, PNG, WebP)'
    ),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const CreateCourseForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { createCourse, addChapter: addChapterToBackend, updateCourseImage } = useCourse();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      isFree: true,
      courseImage: undefined,
    },
  });

  // Image handling functions
  const handleImageSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
      toast.error("Image size must be less than 10MB");
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP)");
      return;
    }

    setSelectedImage(file);
    form.setValue('courseImage', [file]);
  };

  const removeImage = () => {
    setSelectedImage(null);
    form.setValue('courseImage', undefined);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Chapter management functions
  const addChapter = () => {
    const newChapter: ChapterData = {
      id: Date.now().toString(),
      name: `Chapter ${chapters.length + 1}`,
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  };

  const updateChapterName = (chapterId: string, name: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, name } : chapter
    ));
  };

  const updateChapterFile = (chapterId: string, file: File | undefined) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, file, url: undefined } : chapter
    ));
  };

  const updateChapterUrl = (chapterId: string, url: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, url, file: undefined } : chapter
    ));
  };

  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    const newChapters = [...chapters];
    [newChapters[currentIndex], newChapters[newIndex]] = [newChapters[newIndex], newChapters[currentIndex]];
    setChapters(newChapters);
  };

  const onSubmit = async (data: CourseFormValues) => {
    setIsLoading(true);
    
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
      
      form.reset();
      setSelectedImage(null);
      setChapters([]);
      toast.success('Course created successfully!');
      router.push("/dashboard/courses");
      
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
          <CardDescription>
            Fill in the details below to create a new course with chapters. Title and description are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              {/* Course Basic Information */}
              <CourseBasicInfo form={form} isLoading={isLoading} />

              {/* Course Pricing Section */}
              <CoursePricing form={form} isLoading={isLoading} />

              {/* Course Image Section */}
              <CourseImageUpload 
                form={form}
                isLoading={isLoading}
                selectedImage={selectedImage}
                handleImageSelect={handleImageSelect}
                removeImage={removeImage}
                imageInputRef={imageInputRef}
              />

              {/* Chapter Management Section */}
              <ChapterManagement
                chapters={chapters}
                isLoading={isLoading}
                onAddChapter={addChapter}
                onRemoveChapter={removeChapter}
                onUpdateChapterName={updateChapterName}
                onUpdateChapterFile={updateChapterFile}
                onUpdateChapterUrl={updateChapterUrl}
                onMoveChapter={moveChapter}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="flex-1 h-11 text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Course...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setChapters([]);
                    setSelectedImage(null);
                  }}
                  disabled={isLoading}
                  className="h-11 px-6 text-base"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourseForm;
