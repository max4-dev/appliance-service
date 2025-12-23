import { ITokens } from "@/shared/api/types/tokens";

export type LoginField = {
  login: string;
  password: string;
};

export interface LoginResponse extends ITokens {

};