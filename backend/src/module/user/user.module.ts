import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/common/database';
import { JwtStrategy } from 'src/module/auth/strategies/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
