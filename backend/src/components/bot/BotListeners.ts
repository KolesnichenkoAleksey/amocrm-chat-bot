import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { NextFunction } from 'express';
import mongoManager from '../mongo/MongoManager';
import amoChatAPI from '../../API/amoChatAPI';
import { errorHandlingByType } from '../../error/errorHandlingByType';
import ClientApi from '../../API/amoAPI';
import { LeadData } from '../../@types/amo/api/amo-api.types';
import { ApiError } from '../../error/ApiError';
import { ctxUpdateEntity } from '../../@types/bot/BotContext';
import { Message, Update } from 'typegram';
import MessageUpdate = Update.MessageUpdate;
import TextMessage = Message.TextMessage;
import { SceneContext } from 'telegraf/typings/scenes';
import { MatchedMiddleware } from 'telegraf/typings/composer';

export class BotListeners {

    constructor(botInstance: Telegraf<Scenes.WizardContext>) {
        this.defineOnActionListeners(botInstance);
        this.defineCommandActionListeners(botInstance);
        this.defineActionListeners(botInstance);
    }

    defineOnActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.on('text', this.textListener);
    }

    defineCommandActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.command('menu', this.menuCommandAction);
        botInstance.command('linkDeal', this.linkDealCommandAction);
    }

    defineActionListeners(botInstance: Telegraf<Scenes.WizardContext>): void {
        botInstance.action('linkedDeal', this.linkedDealButtonAction);
    }

    // on block
    private async textListener(ctx: Context<MessageUpdate<TextMessage>>, next: NextFunction): Promise<void> {
        try {
            // Если сделки нету, то контакт не привязывается к той сделке

            if (ctx?.update?.message?.entities && ctx?.update?.message?.entities?.find((entity: ctxUpdateEntity) => entity.type === 'bot_command')) {
                return next();
            }

            const userTelegramId = ctx?.update?.message?.from?.id;

            if (!userTelegramId) {
                errorHandlingByType(new Error('Не удалось получить telegramId'));
                return;
            }

            const telegramToken = ctx.telegram.token;

            if (!telegramToken) {
                errorHandlingByType(new Error('Не удалось получить telegramToken!'));
                return;
            }

            const messageText = ctx?.update?.message?.text;

            if (!messageText) {
                errorHandlingByType(new Error('Не удалось получить текст сообщения!'));
                return;
            }

            const groupId = ctx?.update?.message?.from?.id === ctx?.update?.message?.chat?.id ? ctx?.update?.message?.from?.id : ctx?.update?.message?.chat?.id;

            if (!groupId) {
                errorHandlingByType(new Error('Не удалось получить groupId!'));
                return;
            }

            const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

            if (!appUser) {
                await ctx.reply('Бот не привязан к аккаунту');
                return;
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

            await ctx.reply('Hello!');
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    };

    // command block
    private async menuCommandAction(menuCommandContext: Context<MessageUpdate<TextMessage>>): Promise<void> {
        try {
            await menuCommandContext.replyWithHTML('Управление ботом', {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Связанные сделки', 'linkedDeal')]
                ])
            });
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    private async linkDealCommandAction(linkDealCommandContext: Context<MessageUpdate<TextMessage>>): Promise<void> {
        try {
            const payload = linkDealCommandContext?.update?.message?.text.replace('/linkDeal', '').trim() || undefined;

            if (!payload) {
                await linkDealCommandContext.reply('Не указан Id сделки!');
                return;
            }

            if (!Number(payload)) {
                await linkDealCommandContext.reply('Id сделки должен быть числом!');
                return;
            }

            const telegramToken = linkDealCommandContext.telegram.token;

            const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

            if (!appUser) {
                await linkDealCommandContext.reply('Бот не привязан к аккаунту');
                return;
            }

            const groupId = linkDealCommandContext.update.message.chat.id;

            const groupName = 'title' in linkDealCommandContext.update.message.chat ? linkDealCommandContext.update.message.chat.title : linkDealCommandContext.update.message.chat.first_name;

            const api = new ClientApi({ subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId });

            const { name = null } = await api.getDeal(Number(payload));

            if (!name) {
                await linkDealCommandContext.reply('Не удалось получить назавание сделки!');
            }

            const deal = { id: Number(payload), name };

            await mongoManager.linkDeal(appUser.accountId, deal, groupId, groupName, telegramToken);

            await linkDealCommandContext.reply('Сделка связана!');
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    // actions block
    private async linkedDealButtonAction(ctx): Promise<void> {
        try {
            await ctx.scene.enter('linked-deal-wizard');
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }
}
