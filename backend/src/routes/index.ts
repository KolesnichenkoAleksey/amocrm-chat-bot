import Router from 'express';
import { widgetRouter } from './widgetRouter';
import { runtimeRouter } from './runtimeRouter';
import { botRouter } from './botRouter';

const router = Router();

router.use('/', runtimeRouter);
router.use('/widget', widgetRouter);
router.use('/bot', botRouter);

export { router };