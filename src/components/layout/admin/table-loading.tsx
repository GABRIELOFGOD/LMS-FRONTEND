import { Loader2 } from "lucide-react";

const TableLoading = ({ title }: { title?: string }) => {
  return (
    <div className="w-full h-[200px] flex justify-center items-center gap-2">
      <Loader2 size={20} className="animate-spin text-gray-500 my-auto" />
      <p className="my-auto text-sm text-foreground/80 font-semibold">Loading {title}...</p>
    </div>
  )
}
export default TableLoading;