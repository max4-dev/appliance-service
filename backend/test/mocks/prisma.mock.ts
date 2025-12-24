export const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
  request: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  statusHistory: {
    create: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
};
