import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-setu focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-setu text-white hover:bg-green-2 shadow-sm active:translate-y-px",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-line bg-surface text-ink hover:bg-paper-2 hover:border-green shadow-sm",
        secondary: "bg-surface-2 text-ink hover:bg-paper-2 shadow-sm",
        ghost: "hover:bg-surface-2 text-ink",
        link: "text-setu underline-offset-4 hover:underline",
        navy: "bg-info text-white hover:brightness-110 shadow-sm active:translate-y-px",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-10 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
