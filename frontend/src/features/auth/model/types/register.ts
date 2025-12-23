import { ITokens } from "@/shared/api/types/tokens";

export type RegisterField = {
  name: string;
  login: string;
  phone: string;
  password: string;
};

export interface RegisterResponse extends ITokens {
};