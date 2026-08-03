import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { registerSchema, type RegisterFormData } from "../../validators/auth.schema";
import { register as registerUser } from "../../services/auth.service";


import { UserIcon, MailIcon, LockIcon } from "./icons";
import AuthShell from "./AuthShell";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const getStrength = (password: string): StrengthLevel => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score as StrengthLevel;
};

const strengthMap: Record<StrengthLevel, { label: string; color: string; width: string }> = {
  0: { label: "Very weak", color: "bg-red-400", width: "w-1/4" },
  1: { label: "Weak", color: "bg-red-400", width: "w-1/4" },
  2: { label: "Fair", color: "bg-amber-400", width: "w-2/4" },
  3: { label: "Good", color: "bg-emerald-400", width: "w-3/4" },
  4: { label: "Strong", color: "bg-emerald-500", width: "w-full" },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";
  const strength = useMemo(() => getStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        setFormError(error.response?.data?.message || "Registration failed.");
      } else {
        console.error(error);
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Set up your workspace in under a minute.</p>

      {formError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 animate-[fadeIn_0.2s_ease-out]">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-auto space-y-3">
        <Input
          label="Full name"
          placeholder="Your Name"
          icon={<UserIcon />}
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="yourname123@email.com"
          icon={<MailIcon />}
          {...register("email")}
          error={errors.email?.message}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            icon={<LockIcon />}
            {...register("password")}
            error={errors.password?.message}
          />
          {passwordValue.length > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthMap[strength].color} ${strengthMap[strength].width}`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">{strengthMap[strength].label}</p>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter password"
          icon={<LockIcon />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          success={
            !errors.confirmPassword && confirmValue && confirmValue === passwordValue
              ? "Passwords match"
              : undefined
          }
        />

        <Button type="submit" loading={isSubmitting}>
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default RegisterPage;