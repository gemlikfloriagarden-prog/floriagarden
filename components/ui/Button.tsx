"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "outline-light" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-bordo-gradient text-cream shadow-card hover:shadow-glow hover:brightness-110",
  outline:
    "bg-transparent text-bordo border border-bordo/30 hover:border-bordo hover:bg-bordo/5",
  "outline-light":
    "bg-transparent text-cream border border-rose-gold/40 hover:border-rose-gold hover:bg-cream/5",
  ghost:
    "bg-transparent text-cream hover:bg-cream/10",
  gold:
    "bg-rose-gold-gradient text-coffee shadow-glow hover:brightness-105",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[0.95rem]",
  lg: "h-14 px-9 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide",
        "transition-all duration-300 ease-silk hover:-translate-y-0.5 active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/70",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
