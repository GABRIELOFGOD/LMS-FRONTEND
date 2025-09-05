"use client";

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BaseFormProps } from './types';

export const CourseBasicInfo = ({ form, isLoading }: BaseFormProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Course Title
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter course title..."
                className="text-base"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Choose a clear and descriptive title for your course.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Course Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what students will learn in this course..."
                className="min-h-[120px] text-base resize-none"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of the course content and objectives.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
