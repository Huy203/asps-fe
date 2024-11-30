import { VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";

import { typographyVariants } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HoverTextInputProps = React.PropsWithChildren<{
  onSubmit: (value: string) => void;
  className?: string;
  showButton?: boolean;
}> &
  VariantProps<typeof typographyVariants>;

export default function HoverTextInput({
  children,
  className,
  onSubmit,
  variant = "body1",
  showButton = false,
}: HoverTextInputProps) {
  const [value, setValue] = useState(children?.toString() || "");
  useEffect(() => {
    setValue(children?.toString() || "");
  }, [children?.toString()]);

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     onSubmit(value);
  //   }
  // };

  return (
    <div
      className={cn(
        "relative inline-flex h-9 items-center gap-4 [&_span]:w-0 [&_span]:hover:w-full",
        className
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className={cn("w-full focus-visible:outline-none", typographyVariants({ variant }))}
        // onKeyDown={handleKeyDown}
      />
      {value !== children?.toString() && showButton && (
        <div className="absolute right-0 inline-flex gap-1">
          <Button
            variant="ghost"
            className="size-9 p-2 text-muted-foreground"
            onClick={() => onSubmit(value)}
          >
            <Check />
          </Button>
        </div>
      )}
      <span className="absolute bottom-0 left-1/2 h-[0.5px] -translate-x-1/2 bg-black transition-all duration-300"></span>
    </div>
  );
}
