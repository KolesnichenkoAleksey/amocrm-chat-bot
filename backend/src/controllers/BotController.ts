import { Response, NextFunction, Request } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { getUserLogger, mainLogger } from '../components/logger/logger';
import botsState from '../state/BotsState';
import { Bot } from '../components/bot/Bot';
import telegramAPI from '../API/telegramAPI';
import mongoManager from '../components/mongo/MongoManager';
import { InitializingBot, UserInterface } from '../@types/models/UserInterface';
import {
    TypedRequestAddBot, TypedRequestChangePipeline,
    TypedRequestDeleteBot,
    TypedRequestGetAllBot, TypedRequestGetAllBotByAccountId, TypedRequestGetAllLinkedGroups,
    TypedRequestGetByAccountBot, TypedRequestUnlinkDeal
} from '../@types/express-custom/RequestBot';

class BotController {
    async addBot(req: TypedRequestAddBot, res: Response, next: NextFunction) {
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

            const pipeline = req.body.pipeline || undefined;

            if (!pipeline) {
                userLogger.debug('Не был передан pipelineId!');
                return next(ApiError.badRequest('Не был передан pipelineId!'));
            }

            const newBotToState = {
                botToken,
                botInstance: new Bot(botToken)
            };

            const { username: botName } = await telegramAPI.getMe(botToken) || { username: null };

            if (!botName) {
                userLogger.debug('Не был удалось получить информацию о боте, возможно проблема в токене!');
                return next(ApiError.notFound('Не был удалось получить информацию о боте, возможно проблема в токене!'));
            }

            const appUser: UserInterface | null = await mongoManager.getWidgetUserBySubdomain(subdomain);

            if (!appUser) {
                userLogger.debug('Не удалось получить пользователя виджета!');
                return next(ApiError.notFound('Не удалось получить пользователя виджета!'));
            }

            const isExistLinkedBot = !!appUser.initializingBots.find((botInfo: InitializingBot) => botInfo.botToken === botToken);

            if (isExistLinkedBot) {
                userLogger.debug(`Бот с токеном ${botToken} уже привязан к аккаунту клиента`);
                return next(ApiError.notFound(`Бот с токеном ${botToken} уже привязан к аккаунту клиента`));
            }

            const addedBot = {
                botToken,
                botName,
                pipeline
            };

            await mongoManager.updateUser({ ...appUser, initializingBots: [...appUser.initializingBots, addedBot] });

            newBotToState.botInstance.startListeners().launchInstance().then();

            botsState.setBots([...botsState.getBots(), newBotToState]);

            userLogger.debug(`Bot with token ${botToken} has been started`);

            const bot = await mongoManager.getBotBySubdomainAndToken(subdomain, botToken);

            return res.status(StatusCodes.Ok.Code).json({
                message: StatusCodes.Ok.DefaultMessage,
                bot
            });

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

    async getAllBots(req: TypedRequestGetAllBot, res: Response, next: NextFunction) {
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

    async getLinkedGroups(req: TypedRequestGetAllLinkedGroups, res: Response, next: NextFunction) {
        try {
            const subdomain = req.query.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан SubDomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            // ещё идёт работа

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

    async getAllBotsByAccountId(req: TypedRequestGetAllBotByAccountId, res: Response, next: NextFunction) {
        try {
            const accountId = req.query.accountId || undefined;

            if (!accountId) {
                mainLogger.debug('Не был передан accountId!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            // const userLogger = getUserLogger(accountId);

            const initializingBots = await mongoManager.getAllBotsByAccountId(accountId);

            if (!initializingBots) {
                // userLogger.debug(`У пользователя ${subdomain} нету ботов!`);
                return next(ApiError.notFound(`У пользователя ${accountId} нету ботов!`));
            }

            const bots = [];

            for (const bot of initializingBots) {
                const relatedTgGroups = await mongoManager.getBotTgGroups(accountId, bot.botToken);
                bots.push({
                    ...bot,
                    relatedTgGroups
                });
            }

            return res.status(StatusCodes.Ok.Code).json(bots);

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

    async changePipeline(req: TypedRequestChangePipeline, res: Response, next: NextFunction) {
        try {
            const { accountId, botToken, pipeline } = req.body;

            if (!accountId) {
                mainLogger.debug('Не был передан accountId!');
                return next(ApiError.badRequest('Не был передан accountId!'));
            }

            if (!botToken) {
                mainLogger.debug('Не был передан botToken!');
                return next(ApiError.badRequest('Не был передан botToken!'));
            }

            if (!pipeline) {
                mainLogger.debug('Не был передан pipeline!');
                return next(ApiError.badRequest('Не был передан pipeline!'));
            }

            await mongoManager.changePipeline(accountId, botToken, pipeline);

            return res.status(StatusCodes.Ok.Code).json({ message: 'Изменение воронки прошло успешно' });

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

    async unlinkDeal(req: TypedRequestUnlinkDeal, res: Response, next: NextFunction) {
        try {
            const { accountId, botToken, dealId, groupId } = req.body;

            if (!accountId) {
                mainLogger.debug('Не был передан accountId!');
                return next(ApiError.badRequest('Не был передан accountId!'));
            }

            if (!botToken) {
                mainLogger.debug('Не был передан botToken!');
                return next(ApiError.badRequest('Не был передан botToken!'));
            }

            if (!dealId) {
                mainLogger.debug('Не был передан pipeline!');
                return next(ApiError.badRequest('Не был передан pipeline!'));
            }

            if (!groupId) {
                mainLogger.debug('Не был передан pipeline!');
                return next(ApiError.badRequest('Не был передан pipeline!'));
            }

            await mongoManager.unlinkDeal(accountId, botToken, groupId, dealId);

            return res.status(StatusCodes.Ok.Code).json({ message: 'Сделка успешно отвязана' });

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