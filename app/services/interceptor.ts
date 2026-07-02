import axios from "axios";
import appService from "./appService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "*/*",
  },
});

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookies() {
  ["access_token", "refresh_token", "user_role", "session_id"].forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  });
}

instance.interceptors.request.use((config) => {
  if (!config.headers["Authorization"]) {
    const token = getCookie("access_token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await appService.refreshToken();

        if (res?.status === 200 || res?.status === 201) {
          const { accessToken, refreshToken, sessionId } = res.data?.data ?? {};

          if (accessToken) {
            setCookie("access_token", accessToken, 60 * 60 * 24 * 7);
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          if (refreshToken) {
            setCookie("refresh_token", refreshToken, 60 * 60 * 24 * 30);
          }
          if (sessionId) {
            setCookie("session_id", sessionId, 60 * 60 * 24 * 30);
          }

          return instance(originalRequest);
        }

        throw new Error("Refresh failed");
      } catch {
        if (typeof window !== "undefined") {
          clearAuthCookies();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
