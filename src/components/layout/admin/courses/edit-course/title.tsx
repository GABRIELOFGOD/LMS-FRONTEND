"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCourse } from "@/achive/hooks/create-course";
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

  const { updateCourseTitle } = useCreateCourse();

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
      const response = await updateCourseTitle({
        id: courseId,
        value: value.title
      });

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
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-md p-4">
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
              <Pencil className="h-4 w-4 mr-1" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">{title}</p>
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
export default TitleForm