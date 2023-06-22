import Router from 'express';
import { widgetRouter } from './widgetRouter';
import { runtimeRouter } from './runtimeRouter';
import { botRouter } from './botRouter';
import { chatChannelRouter } from './chatChannelRouter';

const router = Router();

router.use('/', runtimeRouter);
router.use('/widget', widgetRouter);
router.use('/bot', botRouter);
router.use('/chat-channel', chatChannelRouter)


export { router };