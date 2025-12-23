import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/common/database';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
