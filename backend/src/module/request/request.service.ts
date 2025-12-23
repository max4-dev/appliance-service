import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  UpdateRequestStatusDto,
} from './dto/request.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  private async findClient(id: string) {
    const client = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    return client;
  }

  async create(dto: CreateRequestDto) {
    const client = await this.findClient(dto.clientId);

    const request = await this.prisma.request.create({
      data: {
        climateTechType: dto.climateTechType,
        climateTechModel: dto.climateTechModel,
        problemDescription: dto.problemDescription,

        requestStatus: dto.requestStatus,

        startDate: new Date(dto.startDate),

        client: {
          connect: { id: client.id },
        },

        master: {
          connect: { id: dto.masterId },
        },
      },
    });

    await this.prisma.statusHistory.create({
      data: {
        requestId: request.id,
        newStatus: dto.requestStatus,
        oldStatus: 'OPEN',
      },
    });

    if (dto.masterId) {
      await this.prisma.notification.create({
        data: {
          userId: dto.masterId,
          requestId: request.id,
          type: 'ASSIGNED_TO_YOU',
          title: 'Вам назначена новая заявка',
          message: `Вам назначена заявка #${request.id}`,
        },
      });
    }

    return request;
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RequestWhereUniqueInput;
    where?: Prisma.RequestWhereInput;
    orderBy?: Prisma.RequestOrderByWithRelationInput;
  }) {
    return this.prisma.request.findMany({
      ...params,
      include: {
        client: true,
        master: true,
      },
    });
  }

  async getById(id: number) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        client: true,
        master: true,
        comments: {
          include: {
            master: true,
          },
        },
        statusHistories: {
          include: {
            changedBy: true,
          },
        },
      },
    });

    if (!request) {
      throw new HttpException('Заявка не найдена', HttpStatus.NOT_FOUND);
    }
    return request;
  }

  async search(query: string) {
    const idQuery = parseInt(query, 10);
    return this.prisma.request.findMany({
      where: {
        OR: [
          ...(isNaN(idQuery) ? [] : [{ id: idQuery }]),
          { climateTechModel: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } },
          { client: { phone: { contains: query } } },
        ],
      },
      include: {
        client: true,
        master: true,
      },
    });
  }

  async update(id: number, dto: UpdateRequestDto) {
    return this.prisma.request.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(
    id: number,
    dto: UpdateRequestStatusDto,
    changedById: string,
  ) {
    const request = await this.getById(id);

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: {
        requestStatus: dto.status,
        completionDate: dto.status === 'COMPLETED' ? new Date() : null,
      },
    });

    await this.prisma.statusHistory.create({
      data: {
        requestId: id,
        oldStatus: request.requestStatus,
        newStatus: dto.status,
        changedById: changedById,
      },
    });

    if (request.masterID && request.masterID !== changedById) {
      await this.prisma.notification.create({
        data: {
          userId: request.masterID,
          requestId: id,
          type: 'STATUS_CHANGED',
          title: 'Статус заявки изменен',
          message: `Статус заявки #${request.id} изменен на ${dto.status}`,
        },
      });
    }

    return updatedRequest;
  }

  async assignMaster(requestId: number, masterId: string) {
    const master = await this.prisma.user.findUnique({
      where: { id: masterId },
    });

    if (!master || master.role !== 'SPECIALIST') {
      throw new BadRequestException(
        'Мастер не найден или не является специалистом',
      );
    }

    const request = await this.getById(requestId);

    const updatedRequest = await this.prisma.request.update({
      where: { id: requestId },
      data: {
        masterID: masterId,
      },
    });

    if (request.masterID !== masterId) {
      await this.prisma.notification.create({
        data: {
          userId: masterId,
          requestId: requestId,
          type: 'ASSIGNED_TO_YOU',
          title: 'Вам назначена заявка',
          message: `Вам назначена заявка #${requestId}`,
        },
      });
    }

    return updatedRequest;
  }

  async getStatistics() {
    const completedCount = await this.prisma.request.count({
      where: { requestStatus: 'COMPLETED' },
    });

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

    let totalTime = 0;
    for (const req of requests) {
      if (req.completionDate) {
        totalTime += req.completionDate.getTime() - req.startDate.getTime();
      }
    }

    const averageTime =
      requests.length > 0 ? totalTime / requests.length / (1000 * 60 * 60) : 0;

    const issuesByType = await this.prisma.request.groupBy({
      by: ['climateTechType', 'problemDescription'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return {
      completedRequests: completedCount,
      averageCompletionHours: Math.round(averageTime * 100) / 100,
      topIssues: issuesByType,
    };
  }
}
