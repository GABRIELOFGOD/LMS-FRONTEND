"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { CourseFormValues, ChapterData } from './types';
import { courseSchema } from './validation';
import { CourseBasicFields } from './course-basic-fields';
import { CoursePricingSection } from './course-pricing-section';
import { CourseImageSection } from './course-image-section';
import { ChapterManagementSection } from './chapter-management-section';
import { FormActions } from './form-actions';
import { useCourseSubmission } from './use-course-submission';

const CreateCourseForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);

  const { submitCourse } = useCourseSubmission();

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

  const resetForm = () => {
    form.reset();
    setChapters([]);
    setSelectedImage(null);
  };

  const onSubmit = async (data: CourseFormValues) => {
    setIsLoading(true);
    const success = await submitCourse(data, chapters, selectedImage);
    if (success) {
      resetForm();
    }
    setIsLoading(false);
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
              <CourseBasicFields form={form} isLoading={isLoading} />
              
              <CoursePricingSection form={form} isLoading={isLoading} />

              <CourseImageSection 
                form={form} 
                isLoading={isLoading}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />

              <ChapterManagementSection 
                chapters={chapters}
                setChapters={setChapters}
                isLoading={isLoading}
              />

              <FormActions 
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={resetForm}
                isLoading={isLoading}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourseForm;
