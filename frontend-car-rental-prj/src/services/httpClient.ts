import axios from "axios";
import { logger } from "../utils/logger";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug("HTTP Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasAuth: !!token,
    });
    return config;
  },
  (error) => {
    logger.error("HTTP Request Error", error);
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    logger.debug("HTTP Response", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const suppress = !!error.config?.suppressAuthRedirect;

    logger.error("HTTP Response Error", error, {
      status,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (status === 401 && !suppress) {
      logger.warn("Unauthorized - redirecting to login", {
        url: error.config?.url,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
