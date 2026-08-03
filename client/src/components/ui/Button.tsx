import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-500",
  secondary:
    "bg-white text-blue-700 border border-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
};

/**
 * Drop-in replacement for the original Button. Same `loading` prop and
 * default export shape — existing <Button loading={isSubmitting}>Login</Button>
 * usages keep working. Added `variant` (defaults to "primary", matching the
 * old solid-blue look) plus a spinner-based loading state instead of
 * replacing the label text, so the button doesn't visually "jump".
 */
const Button = ({
  children,
  loading = false,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;