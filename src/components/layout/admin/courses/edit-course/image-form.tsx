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
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-md p-4 h-fit">
      <div className="flex items-center justify-between font-medium">
        Course Image
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="font-medium text-sm"
        >
          {isEditing ? (
            "Cancel"
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
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              src={initialData.imageUrl}
              alt="Course Image"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )
      ) : (
        <div className="mt-2">
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

          <div className="w-full justify-end flex mt-4">
          <Button
            onClick={uploadImage}
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? (
              <div className="flex gap-2">
                <Loader className="my-auto animate-spin" />
                <p className="my-auto">Saving</p>
              </div>
            ) : "Save image"}
          </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
