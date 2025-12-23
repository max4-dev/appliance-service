import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, masterID: string) {
    const request = await this.prisma.request.findUnique({
      where: { id: dto.requestID },
    });

    if (!request) {
      throw new BadRequestException('Заявка не найдена');
    }

    const comment = await this.prisma.comment.create({
      data: {
        message: dto.message,
        requestID: dto.requestID,
        masterID: masterID,
      },
      include: {
        master: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        request: {
          select: {
            id: true,
            requestStatus: true,
          },
        },
      },
    });

    return comment;
  }

  async getByRequestId(requestId: number) {
    return this.prisma.comment.findMany({
      where: { requestID: requestId },
      include: {
        master: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }) {
    return this.prisma.comment.findMany({
      ...params,
      include: {
        master: true,
        request: true,
      },
    });
  }

  async getById(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        master: true,
        request: true,
      },
    });

    if (!comment) {
      throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async update(id: number, dto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: {
        message: dto.message,
      },
      include: {
        master: true,
        request: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  async getAllComments() {
    return this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        master: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
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
