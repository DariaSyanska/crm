import axios from "axios";
import { getRefreshToken, getToken, removeToken, saveToken } from "@/lib/auth";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
});

let isLoggingOut = false;

const logoutWithToast = () => {
  if (isLoggingOut) return;

  isLoggingOut = true;
  removeToken();

  toast.error("Session expired. Please sign in again.");

  setTimeout(() => {
    window.location.href = "/login";
    isLoggingOut = false;
  }, 800);
};

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url?.includes("/auth/refresh")
    ) {
      logoutWithToast();
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        logoutWithToast();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        saveToken(newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logoutWithToast();
        return Promise.reject(refreshError);
      }
    }

    if (error.response.status === 401) {
      logoutWithToast();
    }

    return Promise.reject(error);
  },
);
