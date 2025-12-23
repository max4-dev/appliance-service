import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/module/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/module/auth/decorators/user.decorator';
import { Roles } from 'src/module/role/decorators/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Get()
  async getAll(@Query('role') role?: UserRole) {
    return this.userService.getAll(role);
  }

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UserProfileDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('password')
  async updatePassword(
    @CurrentUser('id') id: string,
    @Body() dto: UserPasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @Get('role')
  @Auth()
  async checkRole(@CurrentUser('id') userId: string) {
    return this.userService.checkRole(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('ADMIN')
  @Put(':id/role')
  async assignRole(@Param('id') id: string, @Body() dto: { role: UserRole }) {
    return this.userService.assignRole(id, dto);
  }
}
