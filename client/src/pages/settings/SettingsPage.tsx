import { useState } from "react";
import { User, Lock, LogOut, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { updateProfile, changePassword, logout } from "../../services/auth.service";

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileSave = async () => {
    if (!name.trim() || savingProfile) return;
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const updated = await updateProfile({ name });
      setUser(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    logoutStore();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile and account preferences.</p>
      </div>

      {/* Profile section */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
            <User size={16} />
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-gray-900">Profile</h2>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
            {(user?.name ?? "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name ?? "User"}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Display name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
          <input
            value={user?.email ?? ""}
            disabled
            className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 outline-none"
          />
          <p className="mt-1.5 text-xs text-gray-400">Email can't be changed here.</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleProfileSave}
            disabled={!name.trim() || savingProfile}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {savingProfile ? <Loader2 size={15} className="animate-spin" /> : null}
            {savingProfile ? "Saving…" : "Save changes"}
          </button>

          {profileSaved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check size={14} /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Password section */}
      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
            <Lock size={16} />
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-gray-900">Password</h2>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {passwordError && <p className="text-xs font-medium text-red-500">{passwordError}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handlePasswordSave}
              disabled={savingPassword}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {savingPassword ? <Loader2 size={15} className="animate-spin" /> : null}
              {savingPassword ? "Updating…" : "Update password"}
            </button>

            {passwordSaved && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <Check size={14} /> Password updated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/40 p-6">
        <h2 className="text-sm font-semibold tracking-tight text-gray-900">Account</h2>
        <p className="mt-1 text-xs text-gray-500">Sign out of CollabOps on this device.</p>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;