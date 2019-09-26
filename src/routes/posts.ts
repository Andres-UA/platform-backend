import { Router, Request, Response } from 'express';
import auth from '../utils/auth';

const router = Router();

router.get('/', auth, (req: Request, res: Response) => {
  return res.json({ post: { title: 'Titulo' } });
});

export default router;
