"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "sacred" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  href?: string;
}

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sacred-gold text-sacred-black hover:bg-sacred-gold-light active:bg-sacred-gold-dark shadow-sacred hover:shadow-sacred-lg transition-all",
  secondary:
    "bg-sacred-cyan text-sacred-black hover:bg-sacred-cyan-light active:bg-sacred-cyan-dark shadow-cyan transition-all",
  outline:
    "border border-sacred-gold/40 text-sacred-gold hover:bg-sacred-gold/10 hover:border-sacred-gold transition-all",
  ghost:
    "text-sacred-gray hover:text-sacred-white hover:bg-white/5 transition-all",
  sacred:
    "bg-gradient-to-r from-sacred-gold via-sacred-cyan to-sacred-gold text-sacred-black font-bold hover:opacity-90 shadow-sacred-lg transition-all bg-[length:200%_100%] hover:bg-[position:100%_0]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-all",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3.5 text-lg rounded-xl",
  xl: "px-10 py-4 text-xl rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className,
      children,
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 font-rajdhani font-semibold tracking-wide cursor-pointer select-none",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sacred-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sacred-black",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    );

    if (href && !disabled) {
      return (
        <a href={href} className={classes}>
          {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
