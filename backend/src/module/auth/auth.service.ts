import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJWTPayload } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, phone, login, password } = dto;

    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          login,
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'Пользователь с таким email или телефоном уже существует',
        );
      }

      const hashedPassword = await hash(password);

      const user = await this.prisma.user.create({
        data: {
          name,
          phone,
          login,
          password: hashedPassword,
          role: 'CLIENT',
        },
      });

      const tokens = await this.issueTokens(user.id, user.phone, user.role);

      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при регистрации');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    if (!user) {
      throw new BadRequestException('Неверный email/телефон или пароль');
    }

    const tokens = await this.issueTokens(user.id, user.phone, user.role);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validatePassword(dto: LoginDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new BadRequestException('Неверный пароль');
    }

    return true;
  }

  private async validateUser({ login, password }: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isValid = await verify(user.password, password);

    if (!isValid) {
      throw new BadRequestException('Неверный пароль');
    }

    return user;
  }

  private async issueTokens(
    userId: string,
    login: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: IJWTPayload = { id: userId, login, role };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    try {
      const result = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!result) {
        throw new UnauthorizedException('Недействительный refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: result.id },
      });

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден или неактивен');
      }

      const tokens = await this.issueTokens(user.id, user.phone, user.role);

      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Ошибка при обновлении токенов');
    }
  }

  private returnUserFields(user: any) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
  }
}
