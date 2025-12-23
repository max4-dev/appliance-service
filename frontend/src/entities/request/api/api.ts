import { CONFIG } from "@/shared/config";

export const requestsApi = {
  root: `${CONFIG.API_URL}/requests`,
  search: `${CONFIG.API_URL}/requests/search`,
  statistics: `${CONFIG.API_URL}/requests/statistics`,
  byId: (id: number) => `${CONFIG.API_URL}/requests/${id}`,
  updateStatus: (id: number) => `${CONFIG.API_URL}/requests/${id}/status`,
  assignMaster: (id: number, masterID: string) => `${CONFIG.API_URL}/requests/${id}/assign/${masterID}`,
};
