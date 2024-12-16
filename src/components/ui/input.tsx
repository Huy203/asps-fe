import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  StartIcon?: React.ElementType;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, StartIcon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:placeholder-muted-foreground",
            className,
            error && "border-destructive",
            StartIcon && "pl-9"
          )}
          ref={ref}
          {...props}
        />
        {StartIcon && (
          <StartIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
