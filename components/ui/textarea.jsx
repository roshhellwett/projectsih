import React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border bg-surface px-4 py-3 text-base text-ink ring-offset-surface placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 ease-out md:text-sm",
        error ? "border-red-500 focus-visible:ring-red-500" : "border-line focus-visible:border-setu focus-visible:ring-setu/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
