import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 focus-visible:ring-blue-400",
  secondary:
    "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost:
    "text-slate-100 hover:text-white hover:bg-white/10 focus-visible:ring-white/30",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          buttonStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
