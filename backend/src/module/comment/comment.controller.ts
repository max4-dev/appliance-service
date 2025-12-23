import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/module/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/module/auth/decorators/user.decorator';
import { RoleGuard } from 'src/module/auth/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('all')
  @Auth()
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  async getAllComments() {
    return this.commentService.getAllComments();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Roles('SPECIALIST', 'MANAGER')
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() dto: CreateCommentDto,
    @CurrentUser('id') masterID: string,
  ) {
    return this.commentService.create(dto, masterID);
  }

  @HttpCode(200)
  @Auth()
  @Get()
  async getAll() {
    return this.commentService.getAll({});
  }

  @HttpCode(200)
  @Auth()
  @Get('request/:requestId')
  async getByRequestId(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.commentService.getByRequestId(requestId);
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('SPECIALIST', 'MANAGER')
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, dto);
  }

  @HttpCode(200)
  @Roles('SPECIALIST', 'MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.delete(id);
  }
}
