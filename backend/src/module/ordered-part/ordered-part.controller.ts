import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/module/auth/decorators/auth.decorator';
import { RoleGuard } from 'src/module/auth/guards/role.guard';
import { Roles } from 'src/module/role/decorators/role.decorator';
import {
  CreateOrderedPartDto,
  UpdateOrderedPartDto,
  UpdatePartStatusDto,
} from './dto/ordered-part.dto';
import { OrderedPartService } from './ordered-part.service';

@Controller('ordered-parts')
export class OrderedPartController {
  constructor(private readonly orderedPartService: OrderedPartService) {}

  @Get('all')
  @Auth()
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  async getAllParts() {
    return this.orderedPartService.getAllParts();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Roles('SPECIALIST', 'MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() dto: CreateOrderedPartDto) {
    return this.orderedPartService.create(dto);
  }

  @HttpCode(200)
  @Auth()
  @Get()
  async getAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.orderedPartService.getAll({ skip, take });
  }

  @HttpCode(200)
  @Auth()
  @Get('request/:requestId')
  async getByRequestId(@Param('requestId') requestId: string) {
    return this.orderedPartService.getByRequestId(parseInt(requestId));
  }

  @HttpCode(200)
  @Auth()
  @Get('pending')
  async getPendingParts() {
    return this.orderedPartService.getPendingParts();
  }

  @HttpCode(200)
  @Auth()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.orderedPartService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('SPECIALIST', 'MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderedPartDto) {
    return this.orderedPartService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePartStatusDto,
  ) {
    return this.orderedPartService.updateStatus(id, dto);
  }

  @HttpCode(200)
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderedPartService.delete(id);
  }
}
