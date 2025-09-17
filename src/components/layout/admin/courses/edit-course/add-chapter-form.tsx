"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import MediaUpload from "./media-upload";

interface ChapterFormData {
  name: string;
  video?: File | string;
}

interface AddChapterFormProps {
  form: UseFormReturn<ChapterFormData>;
  onSubmit: (values: ChapterFormData) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
}

const AddChapterForm = ({ form, onSubmit, isSubmitting, isValid }: AddChapterFormProps) => {
  return (
    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Add New Chapter</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Chapter Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. Introduction to the course"
                    className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">
                  Chapter Media <span className="text-xs text-slate-500">(Video or PDF - Optional, can be added later)</span>
                </FormLabel>
                <FormControl>
                  <MediaUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              size="sm"
            >
              {isSubmitting ? (
                <div className="flex gap-2 items-center">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Chapter"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddChapterForm;
