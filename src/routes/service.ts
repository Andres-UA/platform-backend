import { Router } from 'express';
import { store, index, show, update, destroy } from '../controllers/service.controller';

const router = Router();

router.post('/store', store);
router.post('/index', index);
router.post('/show', show);
router.post('/update', update);
router.post('/destroy', destroy);

export default router;
