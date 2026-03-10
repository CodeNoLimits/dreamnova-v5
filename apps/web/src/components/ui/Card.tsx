"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "sacred" | "outlined";
  hover?: boolean;
  glow?: "gold" | "cyan" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-sacred-black-medium border border-white/5",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10",
  sacred:
    "bg-gradient-to-br from-sacred-black-medium to-sacred-black border border-sacred-gold/20",
  outlined: "bg-transparent border border-white/10",
};

const glowStyles = {
  gold: "hover:shadow-sacred",
  cyan: "hover:shadow-cyan",
  none: "",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  glow = "none",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variantStyles[variant],
        glowStyles[glow],
        paddingStyles[padding],
        hover && "hover:-translate-y-1 hover:border-sacred-gold/30",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({ children, className, as: Tag = "h3" }: CardTitleProps) {
  return (
    <Tag
      className={cn(
        "font-cinzel text-sacred-white tracking-wide",
        Tag === "h1" && "text-3xl",
        Tag === "h2" && "text-2xl",
        Tag === "h3" && "text-xl",
        Tag === "h4" && "text-lg",
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sacred-gray font-rajdhani text-base leading-relaxed", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-6 pt-4 border-t border-white/5", className)}>
      {children}
    </div>
  );
}
