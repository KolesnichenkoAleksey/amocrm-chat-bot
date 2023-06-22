import { Context, Telegraf } from 'telegraf';
import { NextFunction } from 'express';
import { mainLogger } from '../logger/logger';
import mongoManager from '../mongo/MongoManager';
import amoChatAPI from '../../API/amoChatAPI';
import ClientApi from '../../API/amoAPI';
import dayjs from 'dayjs';

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

    private async replyHello(ctx: Context<any>, next: NextFunction) {
        if (ctx?.update?.message?.entities?.find((entity: { offset: number, length: number, type: string }) => entity.type === 'bot_command')) {
            return next();
        }

        const telegramToken = ctx.telegram.token;
        const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);
        
        if (!appUser) {
            return ctx.reply('Бот не привязан к аккаунту');
        }

        const userTelegramId = ctx?.update?.message?.from?.id;
        const userName = ctx?.update?.message?.from?.first_name;

        const groupId = ctx?.update?.message?.chat?.id;        
        const groupName = ctx?.update?.message?.chat?.title || ctx?.update?.chat?.first_name || userName;

        const messageText = ctx?.update?.message?.text;


        // при удалении бота удалять источник 
        // при удалении бота удалять источник
        // при удалении бота удалять источник
        // при удалении бота удалять источник
        // при удалении бота удалять источник
        // РЕАЛИЗОВАЛ ВРОДЕ РАБОТАЕТ


        // когда должно создаваться неразобранное если боту пишут в личку
        // когда должно создаваться неразобранное если боту пишут в личку
        // когда должно создаваться неразобранное если боту пишут в личку
        // когда должно создаваться неразобранное если боту пишут в личку


        const linkedGroup = await mongoManager.getLinkedGroup(appUser.accountId, groupId);

        if (!linkedGroup) {
            await mongoManager.addLinkedGroup(appUser.accountId, 
                {
                    telegramBotToken: telegramToken,
                    telegramGroupId: groupId,
                    telegramGroupName: groupName,
                    deals: [],
                    amoChatIds: [],
                }
            )
        }

        // поиск контакта у нас в бд
        const contactId = await mongoManager.getAmoContactIdByTgUserId(appUser.accountId, userTelegramId);
        const api = new ClientApi({subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId});

        if (!contactId) {
            const newContactId = await api.createContact(userName)
            if (newContactId) {
                await mongoManager.addContactToAccount(appUser.accountId, 
                    {
                        amoCRMContactId: newContactId,
                        telegramName: userName,
                        telegramUserId: userTelegramId
                    }
                )
            }
        }

        const amoContactId = await mongoManager.getAmoContactIdByTgUserId(appUser.accountId, userTelegramId);
        const [bot] = appUser.initializingBots.filter(bot => bot.botToken === telegramToken);

        const newChat = await amoChatAPI.createChat(appUser.amojoScopeId, userTelegramId, groupId, bot.amoChatsSource.external_id, userName + 'Group');
        if (newChat && amoContactId) {
            await mongoManager.addAmoChatByTgGroupId(appUser.accountId, groupId, newChat.id);

            await api.linkChatToContact(newChat.id, amoContactId);
            await new Promise(res => setTimeout(res, 1000))

            const groupDeals = await mongoManager.getGroupDeals(appUser.accountId, groupId)
            if (groupDeals) {
                for (const deal of groupDeals) {
                    await api.linkContactToLead(deal.id, amoContactId);
                }
                await new Promise(res => setTimeout(res, 1000));
            }

            await amoChatAPI.sendMessage(appUser.amojoScopeId, userTelegramId, groupId, messageText, userName);
        }

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

            //========================================================================================================================
            const groupName = linkDealCommandContext.update.message.chat.title || linkDealCommandContext.update.message.chat.first_name            

            const api = new ClientApi({subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId})
            const dealName: string = await api.getDealName(payload) || ''

            const deal = {id: Number(payload), name: dealName}
            await mongoManager.linkDeal(appUser.accountId, deal, groupId, groupName, telegramToken);
            //========================================================================================================================

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
