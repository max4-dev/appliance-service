import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/common/database';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
