// Mock env and jwt
jest.mock('../../config/env', () => ({
  env: { jwtSecret: 'test-secret' },
}));

const mockVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  verify: (...args: any[]) => mockVerify(...args),
}));

import { authenticateToken } from '../../middleware/auth';
import { Request, Response, NextFunction } from 'express';

describe('authenticateToken middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    mockVerify.mockImplementation(() => {
      throw new Error('invalid');
    });
    authenticateToken(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', () => {
    req.headers = { authorization: 'Bearer validtoken' };
    const payload = { userId: 1, email: 'a', name: 'b' };
    mockVerify.mockReturnValue(payload);
    authenticateToken(req as Request, res as Response, next);
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });
});
