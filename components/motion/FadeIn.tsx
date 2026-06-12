"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function FadeIn({
  children,
  className,
  delay: _delay = 0,
  y: _y = 24,
  once: _once = true,
  ...rest
}: FadeInProps) {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
