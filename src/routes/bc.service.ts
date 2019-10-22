import { Router } from 'express';

import {
  store,
  show,
  index,
  update,
  history,
  testFunc
} from '../controllers/bc.service.controller';

const router = Router();

router.post('/:id_service/:type_component/:name_component', store);
router.get('/:id_service/:type_component/:name_component', index);
router.get('/:id_service/:type_component/:name_component/:id_model/history', history);
router.put('/:id_service/:type_component/:name_component/:id_model/:atr_mod/:atr_req/:atr_valor', testFunc);
router.get('/:id_service/:type_component/:name_component/:id_model', show); 
router.put('/:id_service/:type_component/:name_component/:id_model', update);

export default router;
