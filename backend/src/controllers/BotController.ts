import { Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { getUserLogger, mainLogger } from '../components/logger/logger';
import botsState from '../state/BotsState';
import { Bot } from '../components/bot/Bot';
import telegramAPI from '../API/telegramAPI';
import mongoManager from '../components/mongo/MongoManager';
import { UserInterface } from '../@types/models/UserInterface';
import {
    TypedRequestAddBot,
    TypedRequestDeleteBot,
    TypedRequestGetAllBot,
    TypedRequestGetByAccountBot
} from '../@types/express-custom/RequestBot';

class BotController {
    async add(req: TypedRequestAddBot, res: Response, next: NextFunction) {
        try {
            const subdomain = req.body.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан SubDomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            const botToken = req.body.botToken || undefined;

            if (!botToken) {
                userLogger.debug('Не был передан botToken!');
                return next(ApiError.badRequest('Не был передан botToken!'));
            }

            const newBotToState = {
                botToken,
                botInstance: new Bot(botToken)
            };

            const { username: botName } = await telegramAPI.getMe(botToken);

            if (!botName) {
                userLogger.debug('Не был удалось узнать имя бота, возможно проблема в токене!');
                return next(ApiError.notFound('Не был удалось узнать имя бота, возможно проблема в токене!'));
            }

            const addedBot = {
                botToken,
                botName
            };

            const appUser: UserInterface | null = await mongoManager.getWidgetUserBySubdomain(subdomain);

            if (!appUser) {
                userLogger.debug('Не удалось получить пользователя виджета!');
                return next(ApiError.notFound('Не удалось получить пользователя виджета!'));
            }

            if (appUser.initializingBots.find((bot) => bot.botToken === botToken)) {
                userLogger.debug(`Бот с токеном ${botToken} уже привязан к аккаунту клиента`);
                return next(ApiError.notFound(`Бот с токеном ${botToken} уже привязан к аккаунту клиента`));
            }

            await mongoManager.updateUser({ ...appUser, initializingBots: [...appUser.initializingBots, addedBot] });

            newBotToState.botInstance.startListeners().launchInstance().then();

            botsState.setBots([...botsState.getBots(), newBotToState]);

            userLogger.debug(`Bot with token ${botToken} has been started`);

            return res.status(StatusCodes.Ok.Code).json({message: StatusCodes.Ok.DefaultMessage});

        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }
        }
    }

    async getBotsByAccount(req: TypedRequestGetByAccountBot, res: Response, next: NextFunction) {
        try {
            const subdomain = req.query.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан subdomain!');
                return next(ApiError.badRequest('Не был передан subdomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            const botFromAppUser = await mongoManager.getAllBotsBySubdomain(subdomain);

            if (!botFromAppUser) {
                userLogger.debug('У пользователя нет добавленных ботов!');
                return next(ApiError.notFound('У пользователя нет добавленных ботов'));
            }

            return res.status(StatusCodes.Ok.Code).json(botFromAppUser);

        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }
        }
    }

    async getAll(req: TypedRequestGetAllBot, res: Response, next: NextFunction) {
        try {
            const subdomain = req.query.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан SubDomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            const initializingBots = await mongoManager.getAllBotsBySubdomain(subdomain);

            if (!initializingBots) {
                userLogger.debug(`У пользователя ${subdomain} нету ботов!`);
                return next(ApiError.notFound(`У пользователя ${subdomain} нету ботов!`));
            }

            return res.status(StatusCodes.Ok.Code).json(initializingBots);

        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }
        }
    }

    async deleteBot(req: TypedRequestDeleteBot, res: Response, next: NextFunction) {
        try {
            const subdomain = req.body.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан SubDomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            const botTokens = req.body.botTokens || undefined;

            if (!botTokens || !botTokens.length) {
                userLogger.debug('Не были переданы токены бота/ботов');
                return next(ApiError.badRequest('Не были переданы токены бота/ботов'));
            }

            await mongoManager.deleteBots(subdomain, botTokens);

            userLogger.debug('Удаление ботов произошло успешно');
            return res.status(StatusCodes.Ok.Code).json({ message: 'Удаление бота/ботов прошло успешно' });

        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }
        }
    }
}

export default new BotController();