export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}