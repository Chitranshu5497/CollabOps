import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginSchema, type LoginFormData } from "../../validators/auth.schema";
import { login } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";
import { MailIcon, LockIcon } from "./icons";
import AuthShell from "./AuthShell";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { registered?: boolean } };
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    try {
      const response = await login(data);
      setAuth(response.data.user, response.data.accessToken);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        setFormError(
          error.response?.data?.message || "Invalid email or password."
        );
      } else {
        console.error(error);
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back — enter your details to continue.
      </p>

      {location.state?.registered && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 animate-[fadeIn_0.2s_ease-out]">
          Account created. You can sign in now.
        </div>
      )}

      {formError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 animate-[fadeIn_0.2s_ease-out]">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="yourname123@gmail.com"
          icon={<MailIcon />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          icon={<LockIcon />}
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-end text-sm">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isSubmitting}>
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;