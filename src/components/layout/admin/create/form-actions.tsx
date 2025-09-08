"use client";

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const FormActions = ({ onSubmit, onReset, isLoading }: FormActionsProps) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 h-11 text-base font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Course...
          </>
        ) : (
          'Create Course'
        )}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={isLoading}
        className="h-11 px-6 text-base"
      >
        Reset
      </Button>
    </div>
  );
};
