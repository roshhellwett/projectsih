import React from "react";
import { cva } from "class-variance-authority";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-setu focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-setu text-white hover:bg-green-2 shadow-sm hover:shadow-md",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-line bg-surface text-ink hover:bg-paper-2 hover:border-green shadow-sm",
        secondary: "bg-surface-2 text-ink hover:bg-paper-2 shadow-sm",
        ghost: "hover:bg-surface-2 text-ink",
        link: "text-setu underline-offset-4 hover:underline",
        navy: "bg-info text-white hover:brightness-110 shadow-sm hover:shadow-md",
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

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;
    const combinedClassName = cn(
      buttonVariants({ variant, size, className }),
      loading && "cursor-wait opacity-80"
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(combinedClassName, children.props.className),
        ref,
        "aria-busy": loading || undefined,
        "aria-disabled": isDisabled || undefined,
        ...props,
        children: (
          <>
            {loading && (
              <CircleNotch size={16} weight="bold" className="animate-spin shrink-0 -ml-0.5" />
            )}
            {children.props.children}
          </>
        ),
      });
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <CircleNotch size={16} weight="bold" className="animate-spin shrink-0 -ml-0.5" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
