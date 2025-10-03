"use client";

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Image, X } from 'lucide-react';
import { RefObject } from 'react';
import { BaseFormProps } from './types';

interface CourseImageUploadProps extends BaseFormProps {
  selectedImage: File | null;
  handleImageSelect: (file: File) => void;
  removeImage: () => void;
  imageInputRef: RefObject<HTMLInputElement | null>;
}

export const CourseImageUpload = ({ 
  form, 
  isLoading, 
  selectedImage, 
  handleImageSelect, 
  removeImage, 
  imageInputRef 
}: CourseImageUploadProps) => {
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
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
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
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
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
