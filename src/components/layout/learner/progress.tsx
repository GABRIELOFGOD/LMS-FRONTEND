"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const LearnerProgress = ({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) => {
  const [overallProgress, setOverallProgress] = useState<number>(0);

  useEffect(() => {
    if (progress) {
      setOverallProgress(progress);
    }
  }, [progress]);
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p>{label}</p>
        <p>{overallProgress}%</p>
      </div>
      <Progress value={overallProgress} />
    </div>
  )
}
export default LearnerProgress;