export interface UserDTO {
  id: string;
  phone: string;
  login: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "SPECIALIST" | "CLIENT";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserView {
  id: string;
  phone: string;
  login: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "SPECIALIST" | "CLIENT";
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SPECIALIST = "SPECIALIST",
  CLIENT = "CLIENT",
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Администратор",
  [UserRole.MANAGER]: "Менеджер",
  [UserRole.SPECIALIST]: "Специалист",
  [UserRole.CLIENT]: "Клиент",
};

export interface User {
  id: string;
  phone: string;
  login: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  phone: string;
  login: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  role?: UserRole;
  password?: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
}
