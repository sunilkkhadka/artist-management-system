import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { login, logout, register } from "../api/auth.service";
import {
  AuthAction,
  AuthState,
  LoginProps,
  RegisterProps,
} from "../types/auth.type";
import { AuthContext, AuthDispatchContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

export const useAuthDispatch = (): React.Dispatch<AuthAction> => {
  const context = useContext(AuthDispatchContext);
  if (context === null) {
    throw new Error(
      "useAuthDispatch must be used inside an AuthDispatchProvider"
    );
  }

  return context;
};

export const useRegisterUser = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: (user: RegisterProps) => register(user),
    onSuccess: () => {
      history.push("/login");
      return toast.success("Registration Successful");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          return toast.error("Email already exists");
        }
      }
    },
  });
};

export const useLoginUser = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: (loginUser: LoginProps) => login(loginUser),
    onSuccess: (successResponse) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: successResponse?.data?.email,
          username: successResponse?.data?.username,
          role: successResponse?.data?.role,
          token: successResponse?.data?.token,
          isLoggedIn: true,
        })
      );

      console.log(successResponse);

      history.push("/");
      return toast.success("Logged in successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return toast.error("User not found");
        } else if (error.response?.status === 422) {
          return toast.error("Required fields are empty");
        } else if (error.response?.status === 401) {
          return toast.error("Invalid credentials");
        }
      }
    },
  });
};

export const useLogout = () => {
  const history = useHistory();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      localStorage.removeItem("user");
      history.push("/login");
      return toast.success("Logged out");
    },
  });
};
