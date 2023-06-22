import { Context, Markup } from 'telegraf';
import { NextFunction } from 'express';
import { errorHandlingByType } from '../../../../error/errorHandlingByType';
import { CallbackQuery, Update } from 'typegram';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;
import DataQuery = CallbackQuery.DataQuery;
import { WizardContext } from 'telegraf/typings/scenes';
import { LinkedGroups } from '../../../../@types/models/LinkedDealsInterface';
import mongoManager from '../../../mongo/MongoManager';
import ClientApi from '../../../../API/amoAPI';

async function leadsMenuHandler(context: Context<CallbackQueryUpdate<DataQuery>> & WizardContext): Promise<void> {
    try {
        await context.editMessageText('Управление ботом', {
            ...Markup.inlineKeyboard([
                [Markup.button.callback('Связанные сделки', 'linkedDeal')]
            ])
        });
    } catch (error: unknown) {
        errorHandlingByType(error);
    }
}

async function dealListButtonsHandler(context: Context<CallbackQueryUpdate>): Promise<void> {
    try {
        const telegramChatId = context.update.callback_query.message.chat.id;

        const linkedDeals: LinkedGroups | null = await mongoManager.getLinkedDealByTelegramId(telegramChatId);

        if (!linkedDeals) {
            await context.editMessageText('Нет связанных сделок!');
        }

        await context.editMessageText('Связанные сделки!', {
            ...Markup.inlineKeyboard(
                [...linkedDeals.deals.map(({ id, name }) => {
                    return [Markup.button.callback(name, String(id))];
                }),
                    [Markup.button.callback('Назад ⬅', 'backToMainMenu')]
                ]
            )
        });
    } catch (error: unknown) {
        errorHandlingByType(error);
    }
}

async function unlinkDeal(context: Context<CallbackQueryUpdate<DataQuery>> & WizardContext): Promise<void> {
    try {
        const botToken = context.telegram.token;

        const appUser = await mongoManager.getWidgetUserByBotToken(botToken);

        if (!appUser) {
            await leadsMenuHandler(context);
            return context.scene.leave();
        }

        const dealId = context.session.__scenes.state['dealId'];
        delete context.session.__scenes.state['dealId'];

        const groupId = context.update.callback_query.message.chat.id;

        await mongoManager.unlinkDeal(appUser.accountId, botToken, groupId, dealId);

        await dealListButtonsHandler(context);

        context.wizard.next();
        context.wizard.selectStep(1);
    } catch (error: unknown) {
        errorHandlingByType(error)
    }
}

export const WizardSteps = {
    listDeal: async (wizardCtx: Context<CallbackQueryUpdate<DataQuery>> & any/*Ничего не могу с этип поделать*/, next: NextFunction) => {
        try {
            if (!wizardCtx.update.callback_query) {
                next();
                return wizardCtx.scene.leave();
            }

            await dealListButtonsHandler(wizardCtx);

            return wizardCtx.wizard.next();
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    },
    dealMenu: async (wizardCtx: Context<CallbackQueryUpdate<DataQuery>> & WizardContext, next: NextFunction) => {
        try {
            if (!wizardCtx.update.callback_query) {
                next();
                return wizardCtx.scene.leave();
            }

            const botToken = wizardCtx.telegram.token;

            const contextData = wizardCtx.update.callback_query?.data;

            if (!Number(contextData)) {
                if (contextData === 'backToMainMenu') {
                    await leadsMenuHandler(wizardCtx);
                    next();
                    return wizardCtx.scene.leave();
                }
            }

            const appUser = await mongoManager.getWidgetUserByBotToken(botToken);

            if (!appUser) {
                await leadsMenuHandler(wizardCtx);
                next();
                return wizardCtx.scene.leave();
            }

            const api = new ClientApi({ subDomain: appUser.widgetUserSubdomain, accountId: appUser.accountId });

            const deal = await api.getDeal(Number(contextData));

            if (!deal) {
                await mongoManager.unlinkDeal(appUser.accountId, wizardCtx.telegram.token, wizardCtx.update.callback_query.message.chat.id, Number(contextData));
                await leadsMenuHandler(wizardCtx);
                next();
                return wizardCtx.scene.leave();
            }

            const [dealUrl] = deal._links.self.href.replace('/api/v4/leads/', '/leads/detail/').split('?');

            await wizardCtx.editMessageText(`Название сделки: <b>${deal.name.toUpperCase()}</b>` + '\n' + `Ссылка: ${dealUrl}`, {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('Отвязать сделку 🔗', 'unlinkDeal')],
                    [Markup.button.callback('Назад ⬅', 'backToDealList')]
                ]),
                parse_mode: 'HTML'
            });

            wizardCtx.session.__scenes.state['dealId'] = deal.id;

            return wizardCtx.wizard.next();
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    },
    proofActionButtons: async (wizardCtx: Context<CallbackQueryUpdate<DataQuery>> & WizardContext, next: NextFunction) => {
        try {
            if (!wizardCtx.update.callback_query) {
                next();
                return wizardCtx.scene.leave();
            }

            const payload = wizardCtx.update.callback_query.data;

            switch (payload) {
                case 'unlinkDeal': {
                    const dealId = wizardCtx.session.__scenes.state['dealId'];

                    await wizardCtx.editMessageText(`Вы уверены, что хотите отвязать сделку c ID => ${dealId}`, {
                        ...Markup.inlineKeyboard([
                            [Markup.button.callback('Подтвердить ✅', 'acceptUnlink')],
                            [Markup.button.callback('Отклонить ❌', 'rejectUnlink')]
                        ]),
                        parse_mode: 'HTML'
                    });

                    wizardCtx.wizard.next();
                }
                    break;
                case 'backToDealList': {
                    await dealListButtonsHandler(wizardCtx);
                    wizardCtx.wizard.next();
                    wizardCtx.wizard.selectStep(1);
                }
                    break;
            }

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    },
    acceptAction: async (wizardCtx: Context<CallbackQueryUpdate<DataQuery>> & WizardContext, next: NextFunction) => {
        try {
            if (!wizardCtx.update.callback_query) {
                next();
                return wizardCtx.scene.leave();
            }

            const payload = wizardCtx.update.callback_query.data;

            switch (payload) {
                case 'acceptUnlink': {
                    await unlinkDeal(wizardCtx);
                }
                    break;
                case 'rejectUnlink': {
                    await dealListButtonsHandler(wizardCtx);
                    wizardCtx.wizard.next();
                    wizardCtx.wizard.selectStep(1);
                }
                    break;
            }

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }
};