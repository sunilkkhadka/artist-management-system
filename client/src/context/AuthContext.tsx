import React, { createContext, useReducer } from "react";

import { AuthState, AuthAction } from "../types/auth.type";

const initialAuthState: AuthState = {
  email: "",
  username: "",
  role: "",
  token: "",
  isLoggedIn: false,
};

export const AuthContext = createContext<AuthState | null>(null);
export const AuthDispatchContext =
  createContext<React.Dispatch<AuthAction> | null>(null);

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        email: action.payload.email,
        username: action.payload.username,
        role: action.payload.role,
        token: action.payload.token,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case "LOGOUT":
      return {
        ...state,
        email: "",
        username: "",
        role: "",
        token: "",
        isLoggedIn: false,
      };
    case "REFRESH_TOKEN":
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, dispatch] = useReducer(reducer, initialAuthState);

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};
