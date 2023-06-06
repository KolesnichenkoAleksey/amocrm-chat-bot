import Router from 'express';
import widgetController from '../controllers/WidgetController';

const router = Router();

router.get('/login', widgetController.installWidget);
router.get('/delete', widgetController.deleteWidget);
router.get('/userStatus', widgetController.getUserStatus);

export { router as widgetRouter };