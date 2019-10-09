import { Router } from 'express';
import {
  store,
  index,
  show,
  update,
  destroy,
} from '../controllers/service.controller';
import { config } from '../controllers/bc.service.controller';

const router = Router();

router.post('/', store);
router.get('/', index);
router.get('/:id/', show);
router.post('/update', update);
router.post('/destroy', destroy);

router.post('/config', config);

export default router;
