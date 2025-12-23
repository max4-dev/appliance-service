import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly StatisticService: StatisticService) {}

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('requests')
  async getRequestStatistic() {
    return this.StatisticService.getRequestStatistic();
  }

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('repair-time')
  async getAverageRepairTime() {
    return this.StatisticService.getAverageRepairTime();
  }

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('defects')
  async getDefectStatistic() {
    return this.StatisticService.getDefectStatistic();
  }

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('specialists')
  async getSpecialistStatistic() {
    return this.StatisticService.getSpecialistStatistic();
  }

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('department')
  async getDepartmentStatistic(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.StatisticService.getDepartmentStatistic(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @HttpCode(200)
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(RoleGuard)
  @Get('problems')
  async getMostCommonProblems(@Query('limit') limit?: string) {
    return this.StatisticService.getMostCommonProblems(
      limit ? parseInt(limit) : 10,
    );
  }
}
