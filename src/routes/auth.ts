import { Router } from 'express';
import { login, getUser } from '../controllers/user.controller';
import auth from '../utils/auth';

const router = Router();

router.post('/login', login);
router.post('/me', auth, getUser);

export default router;
