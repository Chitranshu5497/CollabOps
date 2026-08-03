import { create } from "zustand";
import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string |null;
  loading: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
    }),

  setUser: (user) =>
    set({
      user,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      loading: false,
    }),
}));