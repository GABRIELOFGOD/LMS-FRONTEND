"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCourse } from "@/hooks/create-course";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
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
    defaultValues: initialData
  });
  const router = useRouter();

  const { updateCourseTitle } = useCreateCourse();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  useEffect(() => {
    if (isEditing) {
      form.reset(initialData); // Reset form values when editing is toggled
    }
  }, [isEditing, initialData, form]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const response = await updateCourseTitle({
        id: courseId,
        value: value.description
      });

      if (response.message) toast.success(response.message);
      toggleEdit()
      router.refresh();
    } catch (error: any) {
      console.log(error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Description
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="font-medium text-sm"
        >
          {isEditing ? (
            <p>Cancel</p>
          ): (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {initialData.description || "No description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      className="p-3 border-border focus::border-2 rounded-md focus::shadow-md"
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
              >
                {isSubmitting ? <div className="flex gap-2"><Loader className="my-auto" /> <p className="my-auto">saving</p></div> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
export default DescriptionForm;