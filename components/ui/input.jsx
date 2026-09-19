import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md border bg-surface px-4 py-2 text-base text-ink ring-offset-surface file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 ease-out md:text-sm",
        error ? "border-red-500 focus-visible:ring-red-500" : "border-line focus-visible:border-setu focus-visible:ring-setu/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
