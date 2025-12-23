import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/module/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/module/auth/decorators/user.decorator';
import { RoleGuard } from 'src/module/auth/guards/role.guard';
import { Roles } from 'src/module/role/decorators/role.decorator';
import {
  CreateRequestDto,
  UpdateRequestDto,
  UpdateRequestStatusDto,
} from './dto/request.dto';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() dto: CreateRequestDto) {
    return this.requestService.create(dto);
  }

  @HttpCode(200)
  @Auth()
  @Get()
  async getAll() {
    return this.requestService.getAll({});
  }

  @HttpCode(200)
  @Auth()
  @Get('search')
  async search(@Query('q') query: string) {
    return this.requestService.search(query);
  }

  @HttpCode(200)
  @Auth()
  @Get('statistics')
  async getStatistics() {
    return this.requestService.getStatistics();
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.requestService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestDto,
  ) {
    return this.requestService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('MANAGER', 'ADMIN', 'SPECIALIST')
  @UseGuards(RoleGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.requestService.updateStatus(id, dto, userId);
  }

  @HttpCode(200)
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Put(':id/assign/:masterId')
  async assignMaster(
    @Param('id', ParseIntPipe) requestId: number,
    @Param('masterId') masterId: string,
  ) {
    return this.requestService.assignMaster(requestId, masterId);
  }
}
