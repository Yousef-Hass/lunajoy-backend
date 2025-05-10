import { Router } from 'express';
import { googleAuth } from '../controllers/auth';

const authRouter = Router();

authRouter.post('/auth/google', googleAuth);

export default authRouter;
