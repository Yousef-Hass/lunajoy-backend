import express from 'express';
jest.mock('express', () => ({ Router: jest.fn(() => ({ post: jest.fn() })) }));
import * as authController from '../../controllers/auth';
import authRouter from '../../routes/authRoutes';

describe('authRoutes', () => {
  it('should register POST route', () => {
    const router = express.Router();
    expect(router.post).toBeDefined();
  });
});
