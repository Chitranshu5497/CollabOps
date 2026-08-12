import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import AuthShell from "./AuthShell";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { LockIcon } from "./icons";
import api from "../../api/axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to reset password."
        );
      } else {
        setError("Unable to reset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-bold text-slate-900">
        Reset password
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Enter your new password below.
      </p>

      {message && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}

          <div className="mt-2">
            <Link
              to="/login"
              className="font-semibold text-emerald-700 underline"
            >
              Go to login
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="Enter new password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm new password"
          icon={<LockIcon />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" loading={loading}>
          Reset password
        </Button>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordPage;