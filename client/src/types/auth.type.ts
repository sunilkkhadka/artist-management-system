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
