import Router from 'express';
import botController from '../controllers/BotController';

const router = Router();

router.get('/getBots', botController.getAll)
router.get('/getBotsByAccount', botController.getBotsByAccount)
router.post('/addBot', botController.add)
router.patch('/deleteBot', botController.deleteBot)

export { router as botRouter };