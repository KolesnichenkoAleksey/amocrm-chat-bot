import { Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { getUserLogger, mainLogger } from '../components/logger/logger';
import { TypedRequestChatNewMessage, TypedRequestConnectChat } from '../@types/express-custom/RequestChat';
import mongoManager from '../components/mongo/MongoManager';
import BotsState from '../state/BotsState';
import { LastMessageFromAMOInterface } from '../@types/models/LinkedDealsInterface';
import Utils from '../components/utils/Utils';

class ChatChannelController {
    async sendMessage(req: TypedRequestChatNewMessage, res: Response, next: NextFunction) {
        try {
            const newMessageBody = req.body;
            const scopeId = req.params.scope_id;

            if (!newMessageBody) {
                return next(ApiError.badRequest('Не были полученны данные о сообщении!'));
            }

            if (!scopeId) {
                return next(ApiError.badRequest('Не был передан scopeId!'));
            }

            const chatId = newMessageBody.message.conversation.id;
            const text = newMessageBody.message.message.text;

            if (!text) {
                return next(ApiError.badRequest('Не было передано сообщение!'));
            }

            const appUser = await mongoManager.getWidgetUserByScopeId(scopeId);

            if (!appUser) {
                return next(ApiError.badRequest('Не найден пользователь амо!'));
            }

            const tgGroup = await mongoManager.getTgGroupByChatId(appUser.accountId, chatId);

            if (!tgGroup) {
                return next(ApiError.badRequest('Не найдена связанная telegram группа!'));
            }

            const lastMessageFromAmo: LastMessageFromAMOInterface = {
                senderId: newMessageBody.message.sender.id,
                text: newMessageBody.message.message.text,
                time: newMessageBody.time,
            }

            console.log(lastMessageFromAmo);
            console.log(tgGroup.lastMessageFromAMO);
            

            if (!tgGroup.lastMessageFromAMO || Utils.isNOTAmoMessagesEquals(lastMessageFromAmo, tgGroup.lastMessageFromAMO)) {
                const bot = BotsState.getBotByToken(tgGroup.telegramBotToken);
                if (bot && bot.botInstance) {
                    await bot.botInstance.sendMessage(tgGroup.telegramGroupId, text);
                    await mongoManager.editLastMessageFromAMO(appUser.accountId, tgGroup.telegramGroupId, lastMessageFromAmo);
                    // запросы обрабатываются параллельно 
                }
            }

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