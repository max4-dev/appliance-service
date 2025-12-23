import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(role?: UserRole) {
    const users = await this.prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getSpecialists() {
    const specialists = await this.prisma.user.findMany({
      where: {
        role: 'SPECIALIST',
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });

    return specialists;
  }

  async updateProfile(id: string, dto: UserProfileDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            phone: dto.phone,
          },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Email или номер телефона уже используются другим пользователем',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    return updatedUser;
  }

  async updatePassword(id: string, dto: UserPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const hashedNewPassword = await hash(dto.newPassword);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    return updatedUser;
  }

  async checkRole(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return user.role;
  }

  async assignRole(id: string, dto: { role: UserRole }) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        role: dto.role,
      },
    });

    return user;
  }
}
