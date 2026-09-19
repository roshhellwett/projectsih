import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-setu focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-setu text-white hover:bg-green-dark",
        secondary:
          "border-transparent bg-surface-2 text-ink hover:bg-paper-2",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-ink border-line",
        success: "border-transparent bg-green-tint text-green border-green-soft",
        warning: "border-transparent bg-amber-tint text-amber border-amber-tint",
        info: "border-transparent bg-info-tint text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
