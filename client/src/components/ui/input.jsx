import * as React from "react";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/context/ThemeContext";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const { mode } = useThemeContext();
  // Toggle light/dark mode

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        mode === "light" ? "bg-white text-black" : "bg-black text-white",
        className
      )}
      disabled={props.disabled}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
