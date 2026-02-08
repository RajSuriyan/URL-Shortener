import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_APP_URL as string;

/* -------------------- TYPES -------------------- */

// interface RefreshResponse {
//   expires_in: number; // seconds until access token expiry
// }

/* -------------------- AXIOS INSTANCES -------------------- */

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

/* -------------------- CSRF INTERCEPTOR -------------------- */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const csrf = Cookies.get("csrftoken");
  if (csrf) {
    config.headers.set("X-CSRF-Token", csrf);
  }
  return config;
});

export default api;
