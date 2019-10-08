import { Router } from 'express';
import {
  store,
  index,
  show,
  update,
  destroy,
} from '../controllers/service.controller';
import { admin, user } from '../controllers/bc.service.controller';

const router = Router();

router.post('/', store);
router.get('/', index);
router.get('/:id/', show);
router.post('/update', update);
router.post('/destroy', destroy);

router.post('/enrroladmin', admin);
router.post('/registeruser', user);

export default router;
