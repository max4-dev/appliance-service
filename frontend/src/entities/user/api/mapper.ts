import { UserDTO, UserView } from "../types/user";

export const mapUserDtoToView = (dto: UserDTO): UserView => ({
  id: dto.id,
  name: dto.name,
  login: dto.login,
  phone: dto.phone,
  role: dto.role
});