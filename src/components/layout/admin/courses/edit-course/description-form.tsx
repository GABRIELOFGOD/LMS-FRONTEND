"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCourse } from "@/hooks/useCourse";
import { cn } from "@/lib/utils";
import { isError } from "@/services/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export interface DescriptionFormProps {
  initialData: {
    description: string;
  },
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required"
  })
});

const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { updateCourseDescription } = useCourse();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  useEffect(() => {
    if (isEditing) {
      form.reset(initialData);
    }
  }, [isEditing, initialData, form]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const response = await updateCourseDescription(courseId, value.description);

      if (response.message) toast.success(response.message);
      initialData.description = value.description;
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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between font-medium mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Course Description</h3>
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isEditing ? (
            <span className="text-slate-600 dark:text-slate-300">Cancel</span>
          ): (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-3 border border-slate-200 dark:border-slate-600 min-h-[80px]">
          <p className={cn(
            "text-sm whitespace-pre-wrap",
            !initialData.description 
              ? "text-slate-500 dark:text-slate-400 italic" 
              : "text-slate-700 dark:text-slate-200"
          )}>
            {initialData.description || "No description set"}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      disabled={isSubmitting}
                      placeholder="e.g This course is about..."
                      {...field}
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
export default DescriptionForm;