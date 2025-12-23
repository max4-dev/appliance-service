import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  async getRequestStatistic() {
    const total = await this.prisma.request.count();
    const completed = await this.prisma.request.count({
      where: { requestStatus: 'COMPLETED' },
    });
    const inProgress = await this.prisma.request.count({
      where: { requestStatus: 'IN_PROGRESS' },
    });
    const waitingParts = await this.prisma.request.count({
      where: { requestStatus: 'WAITING_PARTS' },
    });
    const open = await this.prisma.request.count({
      where: { requestStatus: 'OPEN' },
    });
    const cancelled = await this.prisma.request.count({
      where: { requestStatus: 'CANCELLED' },
    });

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      inProgress,
      waitingParts,
      open,
      cancelled,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async getAverageRepairTime() {
    const requests = await this.prisma.request.findMany({
      where: {
        requestStatus: 'COMPLETED',
        completionDate: { not: null },
      },
      select: {
        startDate: true,
        completionDate: true,
      },
    });

    if (requests.length === 0) {
      return { averageHours: 0, averageDays: 0 };
    }

    let totalTime = 0;
    for (const req of requests) {
      if (req.completionDate) {
        totalTime += req.completionDate.getTime() - req.startDate.getTime();
      }
    }

    const averageMs = totalTime / requests.length;
    const averageHours = Math.round((averageMs / (1000 * 60 * 60)) * 100) / 100;
    const averageDays =
      Math.round((averageMs / (1000 * 60 * 60 * 24)) * 100) / 100;

    return { averageHours, averageDays };
  }

  async getDefectStatistic() {
    const defects = await this.prisma.request.groupBy({
      by: ['climateTechType'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return defects.map((d) => ({
      equipmentType: d.climateTechType,
      count: d._count.id,
    }));
  }

  async getSpecialistStatistic() {
    const specialists = await this.prisma.user.findMany({
      where: { role: 'SPECIALIST' },
      include: {
        _count: {
          select: { masterRequests: true },
        },
      },
    });

    const specialistStats = [];
    for (const specialist of specialists) {
      const completed = await this.prisma.request.count({
        where: {
          masterID: specialist.id,
          requestStatus: 'COMPLETED',
        },
      });

      specialistStats.push({
        id: specialist.id,
        name: specialist.name,
        totalAssigned: specialist._count.masterRequests,
        completed,
        completionRate:
          specialist._count.masterRequests > 0
            ? Math.round((completed / specialist._count.masterRequests) * 100)
            : 0,
      });
    }

    return specialistStats;
  }

  async getDepartmentStatistic(startDate: Date, endDate: Date) {
    const total = await this.prisma.request.count({
      where: {
        startDate: { gte: startDate, lte: endDate },
      },
    });

    const completed = await this.prisma.request.count({
      where: {
        startDate: { gte: startDate, lte: endDate },
        requestStatus: 'COMPLETED',
      },
    });

    const inProgress = await this.prisma.request.count({
      where: {
        startDate: { gte: startDate, lte: endDate },
        requestStatus: 'IN_PROGRESS',
      },
    });

    const requests = await this.prisma.request.findMany({
      where: {
        startDate: { gte: startDate, lte: endDate },
        requestStatus: 'COMPLETED',
        completionDate: { not: null },
      },
      select: {
        startDate: true,
        completionDate: true,
      },
    });

    let totalTime = 0;
    for (const req of requests) {
      if (req.completionDate) {
        totalTime += req.completionDate.getTime() - req.startDate.getTime();
      }
    }

    const averageTime =
      requests.length > 0 ? totalTime / requests.length / (1000 * 60 * 60) : 0;

    return {
      totalRequests: total,
      completedRequests: completed,
      inProgressRequests: inProgress,
      averageRepairTime: Math.round(averageTime * 100) / 100,
      periodStartDate: startDate,
      periodEndDate: endDate,
    };
  }

  async getMostCommonProblems(limit: number = 10) {
    const problems = await this.prisma.request.groupBy({
      by: ['problemDescription'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    return problems.map((p) => ({
      problem: p.problemDescription,
      count: p._count.id,
    }));
  }
}
