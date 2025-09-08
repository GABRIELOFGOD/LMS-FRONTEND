"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, Image } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { BaseFormProps } from './types';

interface CourseImageSectionProps extends BaseFormProps {
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
}

export const CourseImageSection = ({ 
  form, 
  isLoading, 
  selectedImage, 
  setSelectedImage 
}: CourseImageSectionProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
      toast.error("Image size must be less than 10MB");
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP)");
      return;
    }

    setSelectedImage(file);
    form.setValue('courseImage', [file] as any);
  };

  const removeImage = () => {
    setSelectedImage(null);
    form.setValue('courseImage', undefined);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Course Image</h3>
      
      <FormField
        control={form.control}
        name="courseImage"
        render={() => (
          <FormItem>
            <FormLabel>Course Thumbnail</FormLabel>
            <FormControl>
              <div className="space-y-2">
                {selectedImage ? (
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">{selectedImage.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-2">
                      Click to upload course thumbnail
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, or WebP up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(file);
                  }}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </FormControl>
            <FormDescription>
              Upload an attractive thumbnail image for your course.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
