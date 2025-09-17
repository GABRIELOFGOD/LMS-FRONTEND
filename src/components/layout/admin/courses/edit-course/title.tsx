"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/hooks/useCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { isError } from "@/services/helper";

export interface TitleFormProps {
  title: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required"
  })
});

const TitleForm = ({
  title,
  courseId,
}: TitleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title
    }
  });

  const { updateCourseTitle } = useCourse();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  useEffect(() => {
    if (isEditing) {
      form.reset({title: title});
    }
  }, [isEditing, title, form]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const response = await updateCourseTitle(courseId, value.title);

      if (response.message) toast.success(response.message);
      title = value.title;
      toggleEdit();
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 font-medium mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Course Title</h3>
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 w-full sm:w-auto"
        >
          {isEditing ? (
            <span className="text-slate-600 dark:text-slate-300">Cancel</span>
          ): (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-3 border border-slate-200 dark:border-slate-600">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium break-words">
            {title || "No title set"}
          </p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Digital Management"
                      className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <div className="flex gap-2 items-center">
                    <Loader className="h-4 w-4 animate-spin" /> 
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
export default TitleForm