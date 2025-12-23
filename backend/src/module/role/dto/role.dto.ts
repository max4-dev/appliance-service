import { UserRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class RoleDto {
  @IsEnum(UserRole)
  value: UserRole;
}
