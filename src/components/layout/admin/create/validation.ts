import * as z from 'zod';

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      'Price must be a valid number greater than or equal to 0'
    ),
  isFree: z.boolean().default(true),
  courseImage: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || file.length === 0) return true; // Optional file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return validTypes.includes(file[0]?.type);
      },
      'Please upload a valid image file (JPEG, PNG, WebP)'
    ),
});
