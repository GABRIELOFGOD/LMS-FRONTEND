"use client";

import { BookOpen } from "lucide-react";

const EmptyChaptersState = () => {
  return (
    <div className="text-center py-12 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
      <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">No chapters created yet</p>
      <p className="text-slate-400 dark:text-slate-500 text-xs">Click &quot;Add chapter&quot; to get started</p>
    </div>
  );
};

export default EmptyChaptersState;
