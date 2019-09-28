import { Router } from 'express';
import {
  store,
  index,
  show,
  update,
  destroy,
} from '../controllers/service.controller';
import {
  admin,
  user,
  query,
  invoke,
} from '../controllers/bc.service.controller';

const router = Router();

router.post('/', store);
router.post('/index', index);
router.post('/show', show);
router.post('/update', update);
router.post('/destroy', destroy);

router.post('/enrroladmin', admin);
router.post('/registeruser', user);
router.post('/query', query);
router.post('/invoke', invoke);

export default router;
