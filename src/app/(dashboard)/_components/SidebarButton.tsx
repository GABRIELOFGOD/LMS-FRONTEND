"use client";

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export interface SidebarButtonProp {
  href: string;
  label: string;
  icon: LucideIcon;
}

const SidebarButton = ({
  href,
  label,
  icon: Icon
}: SidebarButtonProp) => {
  const router = useRouter();
  const path = usePathname();
  
  const isActive: boolean = (path === "/" && href === "/") || path === href || path?.startsWith(`${href}/`);
  
  return (
    <button
      className={cn(
        "flex items-center gap-x-2 text-slate-900 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-primary/10 cursor-pointer",
        isActive && "text-primary bg-primary/30 hover:bg-primary/30 hover:text-primary font-bold relative"
      )}
      onClick={() => router.push(href)}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-900",
            isActive && "text-primary"
          )}
        />
        {label}
      </div>
      <div className={cn(
        "h-full border-2 border-primary ml-auto right-0 opacity-0 transition-all absolute",
        isActive && "opacity-100"
      )}></div>
    </button>
  )
}
export default SidebarButton