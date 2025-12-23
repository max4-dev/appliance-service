import { CONFIG } from "@/shared/config";

export const userApi = {
  profile: `${CONFIG.API_URL}/users/profile`,
  byRole: ({ role }: { role: string }) => `${CONFIG.API_URL}/users?role=${role}`,
}