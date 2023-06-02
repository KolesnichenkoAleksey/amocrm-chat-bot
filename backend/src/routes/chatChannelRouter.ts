import Router from 'express';
import chatChannelController from '../controllers/ChatChannelController';

const router = Router();

router.get('/sendMessage/:scope_id', chatChannelController.sendMessage);
router.get('/chatConnect', chatChannelController.chatConnect);

export { router as chatChannelRouter };