import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Boxes } from "lucide-react";
import workChat from "../../assets/work-chat.svg";
const tabs = [
  { label: "Sign In", to: "/login" },
  { label: "Sign Up", to: "/register" },
];

const AuthTabs = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

const PromoPanel = () => (
  <div className="relative hidden h-full flex-col items-center justify-center overflow-hidden lg:flex">
    <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 animate-[float_8s_ease-in-out_infinite] rounded-full bg-blue-300/30 blur-3xl" />
    <div className="pointer-events-none absolute -right-16 bottom-8 h-80 w-80 animate-[floatSlow_10s_ease-in-out_infinite] rounded-full bg-cyan-300/30 blur-3xl" />

    <div className="relative z-10 mt-8 mb-10">
      <div className="h-16 w-16 rounded-lg bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
        
        <Boxes className="h-10 w-10 text-white" strokeWidth={2.5} />
      </div>
    </div>

    <div className="relative z-10 max-w-md text-center">
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
        Welcome to
        <br />
        CollabOps
      </h2>
      <p className="mt-4 text-base text-slate-500">
        Real-time chat, collaborative editing, and background jobs, all in one
        place your team already trusts.
      </p>
    </div>

    <div className="relative z-10 mt-12">
      <img
        src={workChat}
        alt="Work Chat Illustration"
        className="mx-auto w-full max-w-lg"
      />
    </div>
  </div>
);

const AuthShell = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-auto"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, #d7f4fb 0%, transparent 45%), " +
          "radial-gradient(circle at 85% 10%, #cdeaf9 0%, transparent 40%), " +
          "radial-gradient(circle at 80% 85%, #8b9df2 0%, transparent 55%), " +
          "radial-gradient(circle at 30% 90%, #a9c9f5 0%, transparent 50%), " +
          "linear-gradient(135deg, #eef9fc 0%, #d7edf8 45%, #bcdcf2 100%)",
      }}
    >
      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white/60 shadow-2xl shadow-blue-900/10 backdrop-blur-2xl animate-[cardIn_0.5s_ease-out] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6 lg:hidden"></div>
            <AuthTabs />
            <div className="mt-8">{children}</div>
          </div>
        </div>

        <div className="hidden bg-white/40 lg:block">
          <PromoPanel />
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
