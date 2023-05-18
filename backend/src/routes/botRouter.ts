import Router from 'express';
import botController from '../controllers/BotController';

const router = Router();

//router.get('/ping', botController.ping);

export { router as botRouter };