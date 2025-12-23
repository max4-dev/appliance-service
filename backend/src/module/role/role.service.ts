import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class RoleService {
  async getAll() {
    return Object.values(UserRole).map((role) => ({ value: role }));
  }

  async getByValue(value: string) {
    const exists = Object.values(UserRole).includes(value as UserRole);

    if (!exists) {
      throw new BadRequestException(
        `Роль "${value}" не существует. Доступные роли: ${Object.values(
          UserRole,
        ).join(', ')}`,
      );
    }

    return { value: value as UserRole };
  }
}
