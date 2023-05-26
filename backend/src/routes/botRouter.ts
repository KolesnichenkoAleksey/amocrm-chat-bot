import Router from 'express';
import botController from '../controllers/BotController';

const router = Router();

router.get('/getBots', botController.getAllBots)
router.get('/getBotsByAccount', botController.getBotsByAccount)
router.post('/addBot', botController.addBot)
router.patch('/deleteBot', botController.deleteBot)

export { router as botRouter };