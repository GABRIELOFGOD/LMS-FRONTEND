import { ReactNode } from "react";

const AdminSection = ({
  title,
  content
}: {
  title: string;
  content: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold text-xl md:text-2xl">{title}</p>
      {content}
    </div>
  )
}
export default AdminSection;