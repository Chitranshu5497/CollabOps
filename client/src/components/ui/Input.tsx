import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: string;
  icon?: ReactNode;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.243L9.88 9.88"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 shrink-0">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

/**
 * Drop-in replacement for the original Input.
 * New, optional props: `icon`, `success`. Everything else (label, error,
 * ref forwarding, all native input props) behaves exactly as before, so
 * existing usages like <Input label="Email" {...register("email")} />
 * keep working unchanged.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, type, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
          {label}
        </label>

        <div
          className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition-all duration-200 focus-within:ring-4 ${
            error
              ? "border-red-300 focus-within:ring-red-100 animate-[shake_0.4s_ease-in-out]"
              : "border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-100"
          } ${className}`}
        >
          {icon && (
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                error ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
              }`}
            >
              {icon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            {...props}
            className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">
            <AlertIcon /> {error}
          </p>
        )}
        {!error && success && (
          <p className="flex items-center gap-1 text-xs text-emerald-500 animate-[fadeIn_0.2s_ease-out]">
            <CheckIcon /> {success}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;