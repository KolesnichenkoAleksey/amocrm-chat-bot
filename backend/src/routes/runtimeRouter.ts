import Router from 'express';
import runtimeController from '../controllers/RuntimeController';

const router = Router();

router.get('/ping', runtimeController.ping);

export { router as runtimeRouter };