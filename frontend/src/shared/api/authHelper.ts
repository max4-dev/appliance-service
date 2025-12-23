import axios from "axios";
import Cookies from "js-cookie";

import { CONFIG } from "@/shared/config";
import { ITokens, Tokens } from "./types/tokens";

export const getAccessToken = () => {
  const accessToken = Cookies.get(Tokens.ACCESS);
  return accessToken || null;
};

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem(Tokens.REFRESH);
  return refreshToken || null;
};

export const getUserFromStorage = async () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

export const removeTokenStorage = () => {
  Cookies.remove(Tokens.ACCESS);
  localStorage.removeItem(Tokens.REFRESH);
  localStorage.removeItem("user");
};

export const logout = () => {
  removeTokenStorage();
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

export const getIsRefreshSent = async () => {
  try {
    const refresh = getRefreshToken();

    const response = await axios.post(`${CONFIG.API_URL}/token/refresh/`, {
      refresh,
    });
    if (response.data.access) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error while checking refresh token:", error);
    return true;
  }
};

export const saveTokenStorage = (data: ITokens) => {
  Cookies.set(Tokens.ACCESS, data.accessToken);
  localStorage.setItem(Tokens.REFRESH, data.refreshToken);
};

export const handleRefreshToken = async (oldRefreshToken: string | null): Promise<string> => {
  if (!oldRefreshToken) {
    throw new Error("refreshToken does not exist");
  }

  try {
    const {
      data: { accessToken: access },
    }: { data: ITokens } = await axios.post(`${CONFIG.API_URL}/token/refresh/`, {
      refresh: oldRefreshToken,
    });

    return access;
  } catch (error) {
    throw new Error(
      `Произошла ошибка при обновлении accessToken и refreshToken - ${error}, токены не обновлены`
    );
  }
};
