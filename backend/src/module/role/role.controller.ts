import {
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleGuard } from 'src/module/auth/guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async getAll() {
    return this.roleService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get(':value')
  async getByValue(@Param() value) {
    return this.roleService.getByValue(value);
  }
}
