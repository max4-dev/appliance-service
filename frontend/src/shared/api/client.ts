import axios, { InternalAxiosRequestConfig } from "axios";

import { CONFIG } from "@/shared/config";

import { HttpCodes } from "./const/httpCodes";

import {
  getAccessToken,
  getIsRefreshSent,
  getRefreshToken,
  handleRefreshToken,
  logout,
  removeTokenStorage,
  saveTokenStorage,
} from "./authHelper";

export const client = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (config.headers && accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) =>
    Promise.reject(
      `Произошла ошибка при использовании accessToken - ${error}, accessToken = ${getAccessToken()}`
    )
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === HttpCodes.Unauthorized) {
      const { config } = error;
      const oldRefreshToken = getRefreshToken();

      if (!oldRefreshToken) {
        logout();
        return Promise.reject(error);
      }

      const isSentToRefresh = await getIsRefreshSent();

      if (isSentToRefresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const access = await handleRefreshToken(oldRefreshToken);
        saveTokenStorage({ accessToken: access, refreshToken: oldRefreshToken });

        config.headers.Authorization = `Bearer ${access}`;
        return client(config);
      } catch (error) {
        logout();
        return Promise.reject(error);
      }
    } else if (error.response && error.response.status === HttpCodes.UserNotFound) {
      removeTokenStorage();
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);
