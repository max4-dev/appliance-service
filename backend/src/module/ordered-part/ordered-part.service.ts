import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import {
  CreateOrderedPartDto,
  UpdateOrderedPartDto,
  UpdatePartStatusDto,
} from './dto/ordered-part.dto';

@Injectable()
export class OrderedPartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderedPartDto) {
    const request = await this.prisma.request.findUnique({
      where: { id: dto.requestId },
    });

    if (!request) {
      throw new BadRequestException('Заявка не найдена');
    }

    const orderedPart = await this.prisma.orderedPart.create({
      data: {
        partName: dto.partName,
        partNumber: dto.partNumber,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        totalPrice: dto.totalPrice,
        supplier: dto.supplier,
        expectedDeliveryDate: dto.expectedDeliveryDate,
        status: 'ORDERED',
        notes: dto.notes,
        requestId: dto.requestId,
      },
    });

    if (request.requestStatus === 'IN_PROGRESS') {
      await this.prisma.request.update({
        where: { id: dto.requestId },
        data: {
          requestStatus: 'WAITING_PARTS',
        },
      });

      if (request.masterID) {
        await this.prisma.notification.create({
          data: {
            userId: request.masterID,
            requestId: dto.requestId,
            type: 'PARTS_ORDERED',
            title: 'Заказаны детали',
            message: `Для заявки #${request.id} заказаны детали`,
          },
        });
      }
    }

    return orderedPart;
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderedPartWhereInput;
    orderBy?: Prisma.OrderedPartOrderByWithRelationInput;
  }) {
    return this.prisma.orderedPart.findMany({
      ...params,
      include: {
        request: true,
      },
    });
  }

  async getByRequestId(requestId: number) {
    return this.prisma.orderedPart.findMany({
      where: { requestId },
      orderBy: {
        orderDate: 'desc',
      },
    });
  }

  async getById(id: string) {
    const part = await this.prisma.orderedPart.findUnique({
      where: { id },
      include: {
        request: true,
      },
    });

    if (!part) {
      throw new HttpException('Деталь не найдена', HttpStatus.NOT_FOUND);
    }

    return part;
  }

  async update(id: string, dto: UpdateOrderedPartDto) {
    return this.prisma.orderedPart.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        request: true,
      },
    });
  }

  async updateStatus(id: string, dto: UpdatePartStatusDto) {
    const part = await this.getById(id);

    const updatedPart = await this.prisma.orderedPart.update({
      where: { id },
      data: {
        status: dto.status,
        actualDeliveryDate: dto.status === 'DELIVERED' ? new Date() : undefined,
      },
    });

    if (dto.status === 'DELIVERED') {
      const pendingParts = await this.prisma.orderedPart.count({
        where: {
          requestId: part.requestId,
          status: { not: 'DELIVERED' },
        },
      });

      if (pendingParts === 0) {
        await this.prisma.request.update({
          where: { id: part.requestId },
          data: {
            requestStatus: 'IN_PROGRESS',
          },
        });
      }
    }

    return updatedPart;
  }

  async delete(id: string) {
    return this.prisma.orderedPart.delete({
      where: { id },
    });
  }

  async getPendingParts() {
    return this.prisma.orderedPart.findMany({
      where: {
        status: { in: ['ORDERED', 'IN_TRANSIT'] },
      },
      include: {
        request: true,
      },
      orderBy: {
        expectedDeliveryDate: 'asc',
      },
    });
  }

  async getAllParts() {
    return this.prisma.orderedPart.findMany({
      orderBy: { orderDate: 'desc' },
      include: {
        request: {
          select: {
            id: true,
            climateTechModel: true,
          },
        },
      },
    });
  }
}
