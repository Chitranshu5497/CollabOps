import api from "../api/axios";
import type {
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const login = async (
  data: LoginInput
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterInput
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};