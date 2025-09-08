import { UseFormReturn } from 'react-hook-form';

// Course form values type
export interface CourseFormValues {
  title: string;
  description: string;
  price?: string;
  isFree: boolean;
  courseImage?: FileList;
}

// Chapter data interface
export interface ChapterData {
  id: string;
  name: string;
  file?: File;
  url?: string;
}

// Common props for form components
export interface BaseFormProps {
  form: UseFormReturn<CourseFormValues>;
  isLoading: boolean;
}
