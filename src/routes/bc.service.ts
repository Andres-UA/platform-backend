import { Router } from 'express';

import {
  store,
  show,
  index,
  update,
} from '../controllers/bc.service.controller';

const router = Router();

router.post('/:id_service', store);
router.get('/:id_service/', index);
router.get('/:id_service/:id_model', show);
router.put('/:id_serv ice/:id_model', update);

export default router;
