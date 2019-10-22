import { Router } from 'express';
import {
  index,
  store
} from '../controllers/user.controller';

const router = Router();

router.get('/', index);
router.post('/', store);

export default router;