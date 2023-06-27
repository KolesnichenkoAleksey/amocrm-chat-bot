import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { NextFunction } from 'express';
import mongoManager from '../mongo/MongoManager';
import amoChatAPI from '../../API/amoChatAPI';
import { errorHandlingByType } from '../../error/errorHandlingByType';
import { Message, Update } from 'typegram';
import MessageUpdate = Update.MessageUpdate;
import ClientApi from '../../API/amoAPI';
import TextMessage = Message.TextMessage;
import Utils from '../utils/Utils';

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

    private async textListener(ctx: Context<MessageUpdate<TextMessage>>, next: NextFunction): Promise<void> {
        try {
            if (ctx?.update?.message?.entities && ctx?.update?.message?.entities?.find((entity: { offset: number, length: number, type: string }) => entity.type === 'bot_command')) {
                return next();
            }

            const telegramToken = ctx.telegram.token;
            const appUser = await mongoManager.getWidgetUserByBotToken(telegramToken);

            if (!appUser) {
                await ctx.reply('Бот не привязан к аккаунту');
            }

            const userTelegramId = ctx?.update?.message?.from?.id;
            const userName = ctx?.update?.message?.from?.first_name;

            const groupId = ctx?.update?.message?.chat?.id;
            const groupName = 'title' in ctx.update.message.chat ? ctx.update.message.chat.title : ctx.update.message.chat.first_name;

            const messageText = ctx?.update?.message?.text;

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

            const contactId = await mongoManager.getAmoContactIdByTgUserId(appUser.accountId, userTelegramId);
            const api = new ClientApi({subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId});
            let amoContactId = contactId;

            const [bot] = appUser.initializingBots.filter(bot => bot.botToken === telegramToken);
            const newChat = await amoChatAPI.createChat(appUser.amojoScopeId, userTelegramId, groupId, bot.amoChatsSource.external_id, userName);

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
                    amoContactId = newContactId;
                }
                await new Promise(res => setTimeout(res, 1000));
            } else {
                const isContactInAmo = await api.isAmoContactIdValid(contactId);

                if (!isContactInAmo) {
                    const newContactId = await api.createContact(userName)
                    if (newContactId) {
                        await mongoManager.editContactAmoId(appUser.accountId, contactId, newContactId);
                        amoContactId = newContactId;
                    }
                    await new Promise(res => setTimeout(res, 1000));
                }
            }

            if (newChat && amoContactId) {
                await mongoManager.addAmoChatByTgGroupId(appUser.accountId, groupId, newChat.id);

                await api.linkChatToContact(newChat.id, amoContactId);
                await new Promise(res => setTimeout(res, 1000));

                const groupDeals = await mongoManager.getGroupDeals(appUser.accountId, groupId)
                if (groupDeals) {
                    for (const deal of groupDeals) {
                        api.linkContactToLead(deal.id, amoContactId);
                    }
                    await new Promise(res => setTimeout(res, 1000));
                }

                await amoChatAPI.sendMessage(appUser.amojoScopeId, userTelegramId, groupId, messageText, userName);
            }
            await ctx.reply('Hello!');
        } catch (error: unknown) {
            return errorHandlingByType(error);
        }
    };

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
