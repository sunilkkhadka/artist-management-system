import { useContext } from "react";
import { AuthContext, AuthDispatchContext } from "../context/AuthContext";
import { AuthAction, AuthState } from "../types/auth.type";

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
