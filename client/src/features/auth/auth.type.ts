export interface AuthState {
  email: string;
  username: string;
  role: string;
  token: string;
  isLoggedIn?: boolean;
}

export type AuthAction =
  | {
      type: "LOGIN";
      payload: AuthState;
    }
  | { type: "LOGOUT" }
  | { type: "REFRESH_TOKEN"; payload: { token: string } };

export type RefreshToken = {
  token: string;
};

export interface LoginProps {
  email: string;
  password: string;
}

export interface RegisterProps {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string | number;
  dob: string;
  gender: string;
  address: string;
}
