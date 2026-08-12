import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthShell from "./AuthShell";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { MailIcon } from "./icons";
import api from "../../api/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);

      // Development only.
      // Later this will come from the email link.
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-bold text-slate-900">
        Forgot password?
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Enter your email and we'll help you reset your password.
      </p>

      {message && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="yourname123@gmail.com"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPasswordPage;