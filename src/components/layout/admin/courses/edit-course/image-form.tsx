"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import UploadComp from "./upload-component";
import { useCourse } from "@/hooks/useCourse";

export interface ImageFormProps {
  initialData: {
    imageUrl: string;
  };
  courseId: string;
}

const formSchema = z.object({
  imageFile: z.any().refine((file) => file instanceof File, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageFile: undefined,
    },
  });

  const { updateCourseImage } = useCourse();
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleDrop = (file: File) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
    form.setValue("imageFile", file);
  };

  const uploadImage = async () => {
    if (!file) return toast.error("Please select a file");
  
    setIsSubmitting(true);
    try {
      const response = await updateCourseImage({
        id: courseId,
        value: file,
      });
  
      if (response?.message) toast.success(response.message);
  
      // Update the initial image
      initialData.imageUrl = response.imageUrl;
  
      // Reset local preview & file
      setPreview(null);
      setFile(null);
      // form.reset();
  
      // Exit editing mode
      toggleEdit();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("[UPLOAD ERROR]", error);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between font-medium mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Course Image</h3>
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isEditing ? (
            <span className="text-slate-600 dark:text-slate-300">Cancel</span>
          ) : !initialData.imageUrl ? (
            <>
              <PlusCircle className="h-4 w-4 mr-1" />
              Add an image
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No image uploaded</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
            <Image
              src={initialData.imageUrl}
              alt="Course Image"
              fill
              className="object-cover"
            />
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <UploadComp
              image={preview}
              setImage={(value) => setPreview(value)}
              setFile={setFile}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleDrop(selected);
              }}
              hidden
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={uploadImage}
              disabled={isSubmitting || !file}
              size="sm"
            >
              {isSubmitting ? (
                <div className="flex gap-2 items-center">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Image"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
