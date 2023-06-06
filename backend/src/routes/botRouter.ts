import Router from 'express';
import botController from '../controllers/BotController';

const router = Router();

router.post('/getBots', botController.getAllBots)
router.get('/getBotsByAccount', botController.getBotsByAccount)
router.get('/getLinkedGroups', botController.getLinkedGroups)
router.post('/addBot', botController.addBot)
router.patch('/deleteBot', botController.deleteBot)

export { router as botRouter };