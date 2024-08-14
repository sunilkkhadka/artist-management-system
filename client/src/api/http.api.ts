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
    const token = localStorage.getItem("at");
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
      localStorage.setItem("at", newAccessToken);
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
