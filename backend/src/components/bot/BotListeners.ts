import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { NextFunction } from 'express';
import { mainLogger } from '../logger/logger';
import mongoManager from '../mongo/MongoManager';
import amoChatAPI from '../../API/amoChatAPI';
import { errorHandlingByType } from '../../error/errorHandlingByType';
import { Message, Update } from 'typegram';
import MessageUpdate = Update.MessageUpdate;
import ClientApi from '../../API/amoAPI';
import { LeadData } from '../../@types/amo/api/amo-api.types';
import { ApiError } from '../../error/ApiError';

export class BotListeners {

    constructor(botInstance: Telegraf<Scenes.WizardContext>) {
        this.defineOnActionListeners(botInstance);
        this.defineCommandActionListeners(botInstance);
        this.defineActionListeners(botInstance)
    }

    defineOnActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.on('text', this.textListener);
    };

    defineCommandActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.command('menu', this.menuCommandAction);
        botInstance.command('linkDeal', this.linkDealCommandAction);
    }

    defineActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.action('linkedDeal', this.linkedDealButtonAction);
    }

    // on block
    private async textListener(ctx: Context<MessageUpdate<Message.TextMessage>>, next: NextFunction): Promise<Message.TextMessage | void> {
        try {
            if (ctx?.update?.message?.entities && ctx?.update?.message?.entities?.find((entity: { offset: number, length: number, type: string }) => entity.type === 'bot_command')) {
                return next();
            }

            const userTelegramId = ctx?.update?.message?.from?.id;

            if (!userTelegramId) {
                throw new Error('Не удалось получить telegramId');
            }

            const telegramToken = ctx.telegram.token;

            if (!telegramToken) {
                throw new Error('Не удалось получить telegramToken!');
            }

            const messageText = ctx?.update?.message?.text;

            if (!messageText) {
                throw new Error('Не удалось получить текст сообщения!');
            }

            const groupId = ctx?.update?.message?.from?.id === ctx?.update?.message?.chat?.id ? ctx?.update?.message?.from?.id : ctx?.update?.message?.chat?.id;

            if (!groupId) {
                throw new Error('Не удалось получить groupId!');
            }

            const isPersonalChat = ctx?.update?.message?.from?.id === ctx?.update?.message?.chat?.id;

            const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

            if (!appUser) {
                return ctx.reply('Бот не привязан к аккаунту');
            }

            const currentBot = appUser.initializingBots.find((bot) => bot.botToken === ctx.telegram.token);

            if (!currentBot) {
                return next(ApiError.notFound('Данный бот не привязан к текущему аккаунту!'));
            }

            const userApi = new ClientApi({ subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId });

            const telegramName = (ctx.update.message.from.first_name ?
                ctx.update.message.from.first_name + ' ' + (ctx.update.message.from.last_name ? ctx.update.message.from.last_name : ' ')
                :
                (ctx.update.message.from.username ? ctx.update.message.from.username : ' ')).trim();

            const amoContact = await mongoManager.getContactByTelegramId(userTelegramId);

            if (!amoContact) {

                const createdContact = {
                    name: telegramName
                };

                const addedContact = await userApi.addContact([createdContact]);

                const [contactInfo] = addedContact._embedded.contacts;

                await mongoManager.linkContact(appUser.accountId, contactInfo.id, userTelegramId, telegramName);

                const createdDeal: LeadData = {
                    pipeline_id: currentBot.pipeline.id,
                    _embedded: {
                        contacts: [{ id: contactInfo.id }]
                    }
                };

                // const addedLead = await userApi.addDeal([createdDeal]);
            }

            await amoChatAPI.sendMessage(appUser.amojoScopeId, userTelegramId, groupId, messageText);

            return ctx.reply('Hello!');
        } catch (error: unknown) {
            return errorHandlingByType(error);
        }
    };

    // command block
    private menuCommandAction(menuCommandContext: Context<any>) {
        return menuCommandContext.replyWithHTML('Управление ботом', {
            ...Markup.inlineKeyboard([
                [Markup.button.callback('Связанные сделки', 'linkedDeal')]
            ])
        });
    }

    private async linkDealCommandAction(linkDealCommandContext: Context<any>) {
        try {
            const payload = linkDealCommandContext?.update?.message?.text.replace('/linkDeal', '').trim() || undefined;

            if (!payload) {
                return linkDealCommandContext.reply('Не указан Id сделки!');
            }

            if (!Number(payload)) {
                return linkDealCommandContext.reply('Id сделки должен быть числом!');
            }

            const telegramToken = linkDealCommandContext.telegram.token;

            const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

            if (!appUser) {
                return linkDealCommandContext.reply('Бот не привязан к аккаунту');
            }

            const groupId = linkDealCommandContext.update.message.chat.id;

            const groupName = linkDealCommandContext.update.message.chat.title || linkDealCommandContext.update.message.chat.first_name;

            const api = new ClientApi({ subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId });

            const { name } = await api.getDeal(Number(payload)) || '';

            if (!name) {
                return linkDealCommandContext.reply('Не удалось получить назавание сделки!');
            }

            const deal = { id: Number(payload), name };

            await mongoManager.linkDeal(appUser.accountId, deal, groupId, groupName, telegramToken);

            return linkDealCommandContext.reply('Сделка связана!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
            }
            if (typeof error === 'string') {
                mainLogger.debug(error);
            }
        }
    }

    // actions block
    private async linkedDealButtonAction(ctx: any) {
        ctx.scene.enter('linked-deal-wizard')
    }
}
