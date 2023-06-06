import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { getUserLogger, mainLogger } from '../components/logger/logger';
import { TypedRequestConnectChat } from '../@types/express-custom/RequestChat';
import mongoManager from '../components/mongo/MongoManager';

class ChatChannelController {
    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(StatusCodes.Ok.Code).json({ message: `${Date.now()}` });
        } catch (error: unknown) {

            if (error instanceof Error) {
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                next(ApiError.internal(error));
            }

        }
    }

    async chatConnect(req: TypedRequestConnectChat, res: Response, next: NextFunction) {
        try {
            const subDomain = req.query.subdomain || undefined;

            if (!subDomain) {
                mainLogger.debug('Не был передан subDomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subDomain);

            const accountId = Number(req.query.accountId);

            if (!accountId) {
                userLogger.debug('Не был передан accountId!');
                return next(ApiError.badRequest('Не был передан accountId!'));
            }

            const appUser = await mongoManager.getWidgetUserByAccountId(accountId);

            if (!appUser) {
                userLogger.debug('Не была найдена информация по аккаунту!');
                return next(ApiError.notFound('Не была найдена информация по аккаунту!'));
            }

            return res.status(200).send('ok');

        } catch (error: unknown) {
            if (error instanceof Error) {
                next(ApiError.internal(error.message));
            }
            if (typeof error === 'string') {
                next(ApiError.internal(error));
            }
        }
    }
}

export default new ChatChannelController();