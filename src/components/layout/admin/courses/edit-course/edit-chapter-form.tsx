"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/types/course";
import { Loader } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import MediaUpload from "./media-upload";

interface ChapterFormData {
  name: string;
  video?: File | string;
}

interface EditChapterFormProps {
  form: UseFormReturn<ChapterFormData>;
  onSubmit: (values: ChapterFormData) => Promise<void>;
  onCancel: () => void;
  chapter: Chapter;
  isSubmitting: boolean;
  isValid: boolean;
}

const EditChapterForm = ({ 
  form, 
  onSubmit, 
  onCancel, 
  chapter, 
  isSubmitting, 
  isValid 
}: EditChapterFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. Introduction to the course"
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
              <FormLabel>Chapter Media (Video or PDF)</FormLabel>
              <FormControl>
                <MediaUpload
                  value={field.value || chapter.video}
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
          >
            {isSubmitting ? (
              <div className="flex gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditChapterForm;
