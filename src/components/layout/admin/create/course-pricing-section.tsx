"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BaseFormProps } from './types';

export const CoursePricingSection = ({ form, isLoading }: BaseFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Course Pricing</h3>
      
      <FormField
        control={form.control}
        name="isFree"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  if (e.target.checked) {
                    form.setValue('price', '');
                  }
                }}
                className="mt-1"
                disabled={isLoading}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Free Course
              </FormLabel>
              <FormDescription>
                Check this box if the course should be free for all students.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {!form.watch('isFree') && (
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Price ($)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Set the price for your course in USD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
