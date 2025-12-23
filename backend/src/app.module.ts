import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './common/utils';
import { AuthModule } from './module/auth/auth.module';
import { RoleModule } from './module/role/role.module';
import { UserModule } from './module/user/user.module';
import { RequestModule } from './module/request/request.module';
import { CommentModule } from './module/comment/comment.module';
import { OrderedPartModule } from './module/ordered-part/ordered-part.module';
import { NotificationModule } from './module/notification/notification.module';
import { StatisticModule } from './module/statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => validateConfig(config),
    }),
    AuthModule,
    UserModule,
    RoleModule,
    RequestModule,
    CommentModule,
    OrderedPartModule,
    NotificationModule,
    StatisticModule,
  ],
})
export class AppModule {}
