"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCourse } from "@/hooks/create-course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export interface TitleFormProps {
  initialData: {
    title: string;
  },
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required"
  })
});

const TitleForm = ({
  initialData,
  courseId,
}: TitleFormProps) => {
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
        value: value.title
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
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Title
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
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">{initialData.title}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
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
              >Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
export default TitleForm