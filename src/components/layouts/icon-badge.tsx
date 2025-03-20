"use client";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";


const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-emerald-100"
      },
      iconVariant: {
        default: "text-primary",
        success: "text-emerald-700"
      },
      size: {
        default: "p-2",
        sm: "p-1.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const iconVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        success: "bg-emerald-700"
      },
      size: {
        default: "h-8 w-8",
        sm: "h-6 w-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantProps = VariantProps<typeof backgroundVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantProps {
  icon: LucideIcon;
}

const IconBadge = ({
  icon: Icon,
  variant,
  size
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ size, variant }))} />
    </div>
  )
}
export default IconBadge