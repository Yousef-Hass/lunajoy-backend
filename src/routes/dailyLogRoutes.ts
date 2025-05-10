import { Router } from 'express';
import { createDailyLog, getDailyLogs } from '../controllers/dailyLogs';
import { authenticateToken } from '../middleware/auth';

const dailyLogRouter = Router();

dailyLogRouter.post('/daily-logs', authenticateToken, createDailyLog);
dailyLogRouter.get('/daily-logs', authenticateToken, getDailyLogs);

export default dailyLogRouter;
