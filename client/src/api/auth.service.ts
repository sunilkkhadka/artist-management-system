import axios from "axios";

import { client } from "./http.api";
import config from "../utils/config";
import routes from "../data/routes.data";
import { LoginProps, RegisterProps } from "../types/auth.type";

export const register = async (user: RegisterProps) => {
  const response = await axios.post(config.API_URL + routes.REGISTER, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

export const login = async (loginUser: LoginProps) => {
  const response = await axios.post(config.API_URL + routes.LOGIN, loginUser, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return response;
};

export const logout = async () => {
  await client.post(routes.LOGOUT);
};
