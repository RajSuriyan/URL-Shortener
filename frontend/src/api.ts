import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_APP_URL as string;

/* -------------------- TYPES -------------------- */

interface RefreshResponse {
  expires_in: number; // seconds until access token expiry
}

/* -------------------- AXIOS INSTANCES -------------------- */

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshApi: AxiosInstance = axios.create({
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

/* -------------------- REFRESH LOCK -------------------- */

let isRefreshing = false;

type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

/* -------------------- PROACTIVE REFRESH TIMER -------------------- */

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleRefresh = (expiresIn: number) => {
  if (refreshTimer) clearTimeout(refreshTimer);

  // Refresh 30s before expiry
  const refreshInMs = Math.max((expiresIn - 30) * 1000, 0);

  refreshTimer = setTimeout(async () => {
    try {
      const resp = await refreshApi.post<RefreshResponse>("/auth/refresh");
      scheduleRefresh(resp.data.expires_in);
    } catch {
      window.location.href = "/login";
    }
  }, refreshInMs);
};

/* -------------------- RESPONSE INTERCEPTOR -------------------- */

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,

//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/auth/refresh")
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         const resp = await refreshApi.post<RefreshResponse>("/auth/refresh");
//         scheduleRefresh(resp.data.expires_in);

//         processQueue();
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
