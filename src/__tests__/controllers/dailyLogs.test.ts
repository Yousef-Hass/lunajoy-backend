jest.mock('../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      save: mockSave,
      create: mockCreate,
      find: mockFind,
    })),
  },
}));

const mockSave = jest.fn();
const mockCreate = jest.fn();
const mockFind = jest.fn();

import { googleAuth } from '../../controllers/auth'; // Not needed, remove if not used
import { createDailyLog, getDailyLogs } from '../../controllers/dailyLogs';

describe('dailyLogs controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      user: { userId: 1 },
      app: { get: jest.fn().mockReturnValue({ emit: jest.fn() }) },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    // Only reset the behavior of the mocks, not the object returned by getRepository
    mockSave.mockReset();
    mockCreate.mockReset();
    mockFind.mockReset();
  });

  describe('createDailyLog', () => {
    it('should create and save a daily log, then emit event and return 201', async () => {
      mockCreate.mockReturnValue({ id: 1 });
      mockSave.mockResolvedValue({ id: 1 });
      req.body = { mood: 'happy' };
      await createDailyLog(req, res);
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
    it('should handle errors and return 500', async () => {
      mockCreate.mockImplementation(() => {
        throw new Error('fail');
      });
      await createDailyLog(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create daily log' });
    });
  });

  describe('getDailyLogs', () => {
    it('should fetch daily logs and return them', async () => {
      mockFind.mockResolvedValue([{ id: 1 }]);
      req.user = { userId: 1 };
      req.query = {};
      await getDailyLogs(req, res);
      expect(mockFind).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
    it('should handle errors and return 500', async () => {
      mockFind.mockRejectedValue(new Error('fail'));
      await getDailyLogs(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch daily logs' });
    });
  });
});
