import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:   "bg-[#0F6A4A] hover:bg-[#0A4F38] text-white border-transparent",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
  danger:    "bg-red-600 hover:bg-red-700 text-white border-transparent",
  ghost:     "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent",
};
const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 font-medium rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0F6A4A]/30",
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
