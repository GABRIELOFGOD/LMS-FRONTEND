import { ReactNode } from "react";

const AdminSection = ({
  title,
  content,
  smallTitle = false
}: {
  title: string;
  content: ReactNode;
  smallTitle?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className={`font-bold text-xl ${smallTitle ? "md:text-lg" : "md:text-2xl"}`}>{title}</p>
      {content}
    </div>
  )
}
export default AdminSection;