import { CONFIG } from "@/shared/config";

export const authApi = {
  login: `${CONFIG.API_URL}/auth/login`,
  register: `${CONFIG.API_URL}/auth/register`,
}