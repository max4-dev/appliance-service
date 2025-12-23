import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../../role/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user = this.jwt.verify(token);

      return requiredRoles.includes(user.role);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          message: 'Нет доступа',
        },
        405,
      );
    }
  }
}
