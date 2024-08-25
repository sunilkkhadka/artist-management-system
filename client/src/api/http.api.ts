import axios from "axios";
import config from "../utils/config";
import { RefreshToken } from "../types/auth.type";

export default axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const client = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    const token = getTokenFromStorage();
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await getRefreshToken();
      setNewTokenInStorage(newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return client(originalRequest);
    }
    return Promise.reject(error);
  }
);

async function getRefreshToken() {
  const response = await client.post<RefreshToken>("/refresh");
  return response?.data?.token;
}

function getTokenFromStorage() {
  let token;
  const storageUser = localStorage.getItem("user");
  if (storageUser === null) {
    token = "";
  } else {
    const user = JSON.parse(storageUser);
    token = user.token;
  }

  return token;
}

function setNewTokenInStorage(newToken: string) {
  const storageUser = localStorage.getItem("user");
  if (storageUser === null) return;
  const user = JSON.parse(storageUser);
  user.token = newToken;
  localStorage.setItem("user", JSON.stringify(user));
}
