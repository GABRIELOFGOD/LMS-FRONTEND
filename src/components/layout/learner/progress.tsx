"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const LearnerProgress = () => {
  const [overallProgress, setOverallProgress] = useState<number>(0);

  useEffect(() => {
    setOverallProgress(33);
  }, []);
  
  return (
    <div className="flex flex-col gap-2">
      <p>Overrall Progress</p>
      <Progress value={overallProgress} />
    </div>
  )
}
export default LearnerProgress;