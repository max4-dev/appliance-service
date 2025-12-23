import { saveTokenStorage } from "@/shared/api";
import { authQuery } from "../api/query";
import { RegisterField } from "./types/register";

export const register = async (data: RegisterField) => {
  const response = await authQuery.register(data);
  console.log(response);
  
  if (response?.accessToken && response?.refreshToken) {
    saveTokenStorage({ accessToken: response.accessToken, refreshToken: response.refreshToken });

    return { isSuccess: true };
  }

  return { isSuccess: false };
}