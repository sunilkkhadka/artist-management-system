import axios from "axios";

import config from "../../../shared/utils/config";
import { client } from "../../../shared/api/http.api";

import routes from "../../../routes/routes.data";
import { RegisterProps, LoginProps } from "../auth.type";

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
