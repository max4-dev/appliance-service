import { saveTokenStorage } from "@/shared/api";
import { authQuery } from "../api/query";
import { LoginField } from "./types/login";

export const login = async (data: LoginField) => {
  const response = await authQuery.login(data);

  if (response?.accessToken && response?.refreshToken) {
    saveTokenStorage({ accessToken: response.accessToken, refreshToken: response.refreshToken });

    return { isSuccess: true };
  }

  return { isSuccess: false };
}