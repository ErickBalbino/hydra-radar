import * as React from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={["animate-spin h-4 w-4", className].filter(Boolean).join(" ")}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
      />
    </svg>
  );
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-800 text-white hover:bg-brand-900 disabled:opacity-60 disabled:cursor-not-allowed",
  outline:
    "border border-neutral-300 text-brand-800 hover:bg-neutral-50 disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-brand-800 hover:bg-neutral-50 disabled:opacity-60 disabled:cursor-not-allowed",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3",
};

export default function Button({
  loading,
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className || "",
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="mr-2" />
          {children}
        </>
      ) : (
        <>
          {leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
          {children}
          {rightIcon ? <span className="ml-2">{rightIcon}</span> : null}
        </>
      )}
    </button>
  );
}
