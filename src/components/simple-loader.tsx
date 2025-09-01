import { Loader2 } from "lucide-react";

const SimpleLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-2">
      <Loader2 size={15} />
      <p className="text-sm font-bold my-auto text-gray-500 animate-pulse">Please wait...</p>
    </div>
  )
}
export default SimpleLoader;