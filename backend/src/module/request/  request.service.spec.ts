import { BadRequestException, HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/common/database/prisma.service';
import { prismaMock } from 'test/mocks/prisma.mock';
import { RequestService } from './request.service';

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(RequestService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('создает заявку и историю статуса', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'client-1' });
      prismaMock.request.create.mockResolvedValue({ id: 1 });
      prismaMock.statusHistory.create.mockResolvedValue({});
      prismaMock.notification.create.mockResolvedValue({});

      const dto: any = {
        clientId: 'client-1',
        masterId: 'master-1',
        homeTechType: 'AC',
        homeTechModel: 'LG',
        problemDescription: 'Не работает',
        startDate: new Date(),
        requestStatus: 'OPEN',
      };

      const result = await service.create(dto);

      expect(prismaMock.user.findUnique).toBeCalledWith({
        where: { id: dto.clientId },
      });

      expect(prismaMock.request.create).toBeCalled();
      expect(prismaMock.statusHistory.create).toBeCalled();
      expect(prismaMock.notification.create).toBeCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('бросает ошибку если клиент не найден', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.create({ clientId: 'x' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getById', () => {
    it('возвращает заявку', async () => {
      prismaMock.request.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.getById(1);

      expect(result.id).toBe(1);
    });

    it('бросает 404 если не найдено', async () => {
      prismaMock.request.findUnique.mockResolvedValue(null);

      await expect(service.getById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('updateStatus', () => {
    it('обновляет статус и пишет историю', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue({
        id: 1,
        requestStatus: 'OPEN',
        masterID: 'master-1',
      } as any);

      prismaMock.request.update.mockResolvedValue({ id: 1 });
      prismaMock.statusHistory.create.mockResolvedValue({});
      prismaMock.notification.create.mockResolvedValue({});

      const result = await service.updateStatus(
        1,
        { status: 'COMPLETED' },
        'manager-1',
      );

      expect(prismaMock.request.update).toBeCalled();
      expect(prismaMock.statusHistory.create).toBeCalled();
      expect(prismaMock.notification.create).toBeCalled();
      expect(result.id).toBe(1);
    });
  });

  describe('assignMaster', () => {
    it('назначает специалиста', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'master-1',
        role: 'SPECIALIST',
      });

      jest.spyOn(service, 'getById').mockResolvedValue({
        id: 1,
        masterID: null,
      } as any);

      prismaMock.request.update.mockResolvedValue({ id: 1 });
      prismaMock.notification.create.mockResolvedValue({});

      const result = await service.assignMaster(1, 'master-1');

      expect(prismaMock.request.update).toBeCalled();
      expect(result.id).toBe(1);
    });

    it('бросает ошибку если мастер не SPECIALIST', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'x',
        role: 'CLIENT',
      });

      await expect(service.assignMaster(1, 'x')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
