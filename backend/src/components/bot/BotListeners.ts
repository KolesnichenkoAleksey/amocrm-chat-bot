import { Context, Telegraf } from 'telegraf';
import { NextFunction } from 'express';
import { mainLogger } from '../logger/logger';
import mongoManager from '../mongo/MongoManager';
import amoChatAPI from '../../API/amoChatAPI';

export class BotListeners {

    constructor(botInstance: Telegraf) {
        this.defineOnActionListeners(botInstance);
        this.defineCommandActionListeners(botInstance);
    }

    defineOnActionListeners(botInstance: Telegraf): void {
        botInstance.on('text', this.replyHello);
        botInstance.on('message', this.replyGoodBye);
    };

    defineCommandActionListeners(botInstance: Telegraf): void {
        botInstance.command('menu', this.menuCommandAction);
        botInstance.command('linkDeal', this.linkDealCommandAction);
    }

    // on block
    private async replyHello(ctx: Context<any>, next: NextFunction) {
        if (ctx?.update?.message?.entities?.find((entity: { offset: number, length: number, type: string }) => entity.type === 'bot_command')) {
            return next();
        }

        const userTelegramId = ctx?.update?.message?.from?.id;

        const telegramToken = ctx.telegram.token;

        const messageText = ctx?.update?.message?.text;

        const groupId = ctx?.update?.message?.from?.id === ctx?.update?.message?.chat?.id ? ctx?.update?.message?.from?.id : ctx?.update?.message?.chat?.id;

        const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

        if (!appUser) {
            return ctx.reply('Бот не привязан к аккаунту');
        }

        await amoChatAPI.sendMessage(appUser.amojoScopeId, userTelegramId, groupId, messageText);

        return ctx.reply('Hello!');
    };

    private replyGoodBye(ctx: Context<any>, next: NextFunction) {
        if (ctx?.update?.message?.entities?.find((entity: { offset: number, length: number, type: string }) => entity.type === 'bot_command')) {
            return next();
        }

        return ctx.reply('Goodbye!');
    };

    // command block
    private menuCommandAction(menuCommandContext: Context<any>) {
        return menuCommandContext.reply('Управление ботом');
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

            await mongoManager.linkDeal(appUser.accountId, payload, groupId, telegramToken);

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
}
