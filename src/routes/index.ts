import { Router } from 'express';
import authRouter from './authRoutes';
import dailyLogRouter from './dailyLogRoutes';

const router = Router();

router.use(authRouter);
router.use(dailyLogRouter);

export default router;
