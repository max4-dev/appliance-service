import { client } from "@/shared/api";
import { LoginField, LoginResponse } from "../model/types/login";
import { RegisterField, RegisterResponse } from "../model/types/register";
import { authApi } from "./api";

const login = async ({login, password}: LoginField) => {
  try {
    const response = await client.post<LoginResponse>(authApi.login, { login, password });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const register = async (data: RegisterField) => {
  try {
    const response = await client.post<RegisterResponse>(authApi.register, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const authQuery = {
  login,
  register
}