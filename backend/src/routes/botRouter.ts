import Router from 'express';
import botController from '../controllers/BotController';

const router = Router();

router.post('/getBots', botController.getAllBots)
router.get('/getBotsByAccount', botController.getBotsByAccount)
router.get('/getLinkedGroups', botController.getLinkedGroups)
router.post('/addBot', botController.addBot)
router.patch('/deleteBot', botController.deleteBot)

//==========================================================================================
router.post('/getAllBots', botController.getAllBotsByAccountId)
router.patch('/unlinkDeal', botController.unlinkDeal)


router.post('/getTgGroupNameByChatId', botController.getTgGroupNameByChatId)
router.patch('/changePipeline', botController.changePipeline)


export { router as botRouter };