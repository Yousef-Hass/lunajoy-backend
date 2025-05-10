// Mocks at the top
jest.mock('../../config/env', () => ({
  env: {
    googleClientId: 'test-client-id',
    jwtSecret: 'test-secret',
  },
}));

const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();

jest.mock('../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      findOne: mockFindOne,
      create: mockCreate,
      save: mockSave,
    })),
  },
}));

const mockVerifyIdToken = jest.fn();
class MockOAuth2Client {
  verifyIdToken = mockVerifyIdToken;
}
jest.mock('google-auth-library', () => ({
  OAuth2Client: MockOAuth2Client,
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked-jwt'),
}));

import { googleAuth } from '../../controllers/auth';

describe('auth controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: { token: 'token' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
    // Only reset the behavior of the mocks, not the object returned by getRepository
    mockFindOne.mockReset();
    mockCreate.mockReset();
    mockSave.mockReset();
    mockVerifyIdToken.mockReset();
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => undefined });
  });

  it('should authenticate and return user and token', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: () => ({ email: 'a', name: 'b', sub: 'c' }),
    });
    mockFindOne.mockResolvedValue({ id: 1, email: 'a', name: 'b' });
    await googleAuth(req, res);
    expect(res.json).toHaveBeenCalledWith({
      token: 'mocked-jwt',
      user: { id: 1, email: 'a', name: 'b' },
    });
  });

  it('should create user if not found', async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({ email: 'a', name: 'b', sub: 'c' }),
    });
    mockFindOne.mockResolvedValue(undefined);
    mockCreate.mockReturnValue({ id: 2, email: 'a', name: 'b' });
    mockSave.mockResolvedValue({ id: 2, email: 'a', name: 'b' });
    await googleAuth(req, res);
    expect(mockCreate).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      token: 'mocked-jwt',
      user: { id: 2, email: 'a', name: 'b' },
    });
  });

  it('should handle invalid token', async () => {
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => undefined });
    await googleAuth(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should handle errors', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('fail'));
    await googleAuth(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
  });
});
