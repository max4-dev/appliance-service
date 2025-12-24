jest.mock('src/module/auth/decorators/auth.decorator', () => ({
  Auth: () => () => {},
}));

jest.mock('src/module/auth/decorators/user.decorator', () => ({
  CurrentUser: () => () => {},
}));

jest.mock('src/module/auth/guards/role.guard', () => ({
  RoleGuard: class {},
}));

jest.mock('src/module/role/decorators/role.decorator', () => ({
  Roles: () => () => {},
}));

import { Test } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

describe('RequestController', () => {
  let controller: RequestController;
  let service: jest.Mocked<RequestService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            assignMaster: jest.fn(),
            getStatistics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(RequestController);
    service = module.get(RequestService);
  });

  it('create вызывает service.create', async () => {
    service.create.mockResolvedValue({ id: 1 } as any);

    const result = await controller.create({} as any);

    expect(service.create).toBeCalled();
    expect(result).toEqual({ id: 1 } as any);
  });

  it('getById вызывает service.getById', async () => {
    service.getById.mockResolvedValue({ id: 1 } as any);

    const result = await controller.getById(1);

    expect(service.getById).toBeCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('updateStatus вызывает service.updateStatus', async () => {
    service.updateStatus.mockResolvedValue({ id: 1 } as any);

    await controller.updateStatus(1, { status: 'OPEN' } as any, 'user-1');

    expect(service.updateStatus).toBeCalledWith(
      1,
      { status: 'OPEN' },
      'user-1',
    );
  });
});
