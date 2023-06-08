import mongoose from 'mongoose';
import { DataBaseConnectionOptions } from '../../@types/mongo/MongoConfig';
import User from '../../models/userModel';
import { getUserLogger, mainLogger } from '../logger/logger';
import { errorHandlingByType } from '../../error/errorHandlingByType';
import { InitializingBot, PipelineInterface, UserInterface } from '../../@types/models/UserInterface';
import LinkedDealsModel from '../../models/linkedDealsModel';
import LinkedContactsModel from '../../models/linkedContactsModel';
import { DealInterface, LinkedDealsInterface, LinkedGroups } from '../../@types/models/LinkedDealsInterface';
import { LinkedContact, LinkedContactsInterface } from '../../@types/models/LinkedContactsInterface';
import linkedDealsModel from '../../models/linkedDealsModel';

class ManagerMongoDB {
    async connect(UriConnection: string, ConnectionOptions: DataBaseConnectionOptions) {
        mongoose.set('strictQuery', true);
        await mongoose.connect(UriConnection, ConnectionOptions);
    };

    async getWidgetUserByAccountId(accountId: number): Promise<UserInterface | null> {
        if (!accountId) {
            return null;
        }

        try {
            const widgetUser = await User.findOne({ accountId }, { _id: 0 }).lean();
            return widgetUser || null;
        } catch (error: unknown) {
            mainLogger.debug(`Пользователь с Id ${accountId} не был найден!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getWidgetUserBySubdomain(subdomain: string): Promise<UserInterface | null> {
        if (!subdomain) {
            return null;
        }

        const logger = getUserLogger(subdomain);

        try {
            const widgetUser = await User.findOne({ widgetUserSubdomain: subdomain }, { _id: 0 }).lean();
            return widgetUser || null;
        } catch (error: unknown) {
            logger.debug(`Пользователь с сабдоменом ${subdomain} не был найден!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getWidgetUserByBotToken(botToken: string): Promise<UserInterface | null> {
        try {
            const widgetUser = await User.findOne({ 'initializingBots.botToken': botToken }, { _id: 0 }).lean();
            return widgetUser || null;
        } catch (error: unknown) {
            mainLogger.debug(`Пользователь с токеном ${botToken} не был найден!`);
            errorHandlingByType(error);
        }
        return null;
    }

    async insertUser(userContent: UserInterface): Promise<void> {

        const logger = getUserLogger(userContent.widgetUserSubdomain);

        try {

            await User.insertMany(
                {
                    ...userContent
                }
            );

            const userLinkedDeal = await this.getLinkedDealByAppUserId(userContent.accountId);

            if (!userLinkedDeal) {
                await LinkedDealsModel.insertMany({
                    widgetUserId: userContent.accountId,
                    linkedGroups: []
                });
            }

            const userLinkedContact = await this.getLinkedContactsByAppUserId(userContent.accountId);

            if (!userLinkedContact) {
                await LinkedContactsModel.insertMany({
                    widgetUserId: userContent.accountId,
                    linkedContact: []
                });
            }

            logger.debug('Новый пользователь виджета добавлен в базу данных');

        } catch (error: unknown) {
            logger.debug('Произошла ошибка при добавлении нового пользователя в базу данных: ');
            errorHandlingByType(error);
        }
    }

    async updateUser(userContent: UserInterface): Promise<void> {

        const logger = getUserLogger(userContent.widgetUserSubdomain);

        try {

            await User.updateOne(
                { accountId: userContent.accountId },
                {
                    $set: {
                        ...userContent
                    }
                }
            );

            logger.debug(`Данные для ${userContent.widgetUserSubdomain} были обновлены`);

        } catch (error: unknown) {
            logger.debug(`Ошибка обновления данных для ${userContent.widgetUserSubdomain}. Ошибка: `);
            errorHandlingByType(error);
        }
    }

    async getAllBotsBySubdomain(subdomain: string): Promise<InitializingBot[] | null> {
        if (!subdomain) {
            return null;
        }

        const logger = getUserLogger(subdomain);

        try {
            const [{ initializingBots = null } = {}] = await User.find({ widgetUserSubdomain: subdomain }, {
                initializingBots: 1,
                _id: 0
            }).lean() || null;

            return initializingBots || null;
        } catch (error: unknown) {
            logger.debug(`Пользователь с сабдоменом ${subdomain} не был найден!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getBotBySubdomainAndToken(subdomain: string, botToken: string): Promise<InitializingBot | null> {
        if (!subdomain) {
            return null;
        }

        const logger = getUserLogger(subdomain);
        try {
            const [{ initializingBots = null } = {}] = await User.find({ widgetUserSubdomain: subdomain }, {
                initializingBots: 1
            }).lean() || null;

            return initializingBots ? initializingBots.find((bot) => bot.botToken === botToken) || null : null;
        } catch (error: unknown) {
            logger.debug(`Произошла ошибка во время получения бота!`);
            errorHandlingByType(error);
        }
        return null;
    }

    async deleteBots(subdomain: string, botTokens: string[]): Promise<void> {
        if (!subdomain) {
            return mainLogger.debug('Для удаления бота/ботов не был передан subdomain!');
        }

        if (!botTokens.length) {
            return mainLogger.debug('Для удаления бота/ботов не был/были передан/переданы токен/токены!');
        }

        const logger = getUserLogger(subdomain);

        try {
            for (const botToken of botTokens) {
                await User.updateOne({ widgetUserSubdomain: subdomain }, { $pull: { initializingBots: { botToken } } });
            }
        } catch (error: unknown) {
            logger.debug(`Произошла ошибка во время удаления бота/ботов!`);
            errorHandlingByType(error);
        }
    }

    async getAllBots(): Promise<{ initializingBots: InitializingBot[] }[] | null> {
        try {
            const bots = await User.find({}, {
                initializingBots: 1,
                _id: 0
            });

            return bots || null;
        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во время получения всех ботов!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getLinkedDealByAppUserId(appUserId: number): Promise<LinkedDealsInterface | null> {
        try {
            const linkedDeals = await LinkedDealsModel.findOne({ widgetUserId: appUserId }, { _id: 0 }).lean();
            return linkedDeals || null;
        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во время получения всех привязанных сделок!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getLinkedContactsByAppUserId(appUserId: number): Promise<LinkedContactsInterface | null> {
        try {
            const linkedContacts = await LinkedContactsModel.findOne({ widgetUserId: appUserId }, { _id: 0 }).lean();
            return linkedContacts || null;
        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во время получения всех привязанных сделок!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async getAllBotsByAccountId(accountId: number): Promise<InitializingBot[] | null> {
        if (!accountId) {
            return null;
        }

        // const logger = getUserLogger(subdomain);

        try {
            const [{ initializingBots = null } = {}] = await User.find({ accountId }, {
                initializingBots: 1,
                _id: 0
            }).lean() || null;

            return initializingBots || null;
        } catch (error: unknown) {
            // logger.debug(`Пользователь с accountId ${accountId} не был найден!`);
            errorHandlingByType(error);
        }

        return null;
    }

    async changePipeline(accountId: number, botToken: string, pipeline: PipelineInterface): Promise<void> {
        try {
            await User.updateOne(
                { accountId },
                {
                    $set: { ['initializingBots.$[bot].pipeline']: pipeline }
                },
                {
                    arrayFilters: [{ 'bot.botToken': botToken }]
                }
            );

        } catch (error) {
            mainLogger.debug(`Произошла ошибка изменения воронки`);
            errorHandlingByType(error);
        }
    }

    async getBotTgGroups(accountId: number, botToken: string): Promise<LinkedGroups[]> {
        try {
            const linkedDeals: LinkedDealsInterface | null = await LinkedDealsModel.findOne({
                widgetUserId: accountId,
                'linkedGroups.telegramBotToken': botToken
            }, { widgetUserId: 0, _id: 0, 'linkedGroups.telegramBotToken': 0 }).lean();
            const relatedTgGroups = linkedDeals?.linkedGroups || [];
            return [...relatedTgGroups];
        } catch (error) {
            mainLogger.debug(`Произошла ошибка получения групп связанных с ботом`);
            errorHandlingByType(error);
            return [];
        }
    }

    async unlinkDeal(accountId: number, botToken: string, groupId: number, dealId: number): Promise<void> {
        try {
            await linkedDealsModel.updateOne(
                { widgetUserId: accountId, 'linkedGroups.telegramBotToken': botToken },
                {
                    $pull: {
                        'linkedGroups.$[group].deals': { id: dealId }
                    }
                },
                {
                    arrayFilters: [
                        { 'group.telegramGroupId': groupId },
                        { 'deal.id': dealId }
                    ]
                }
            );
        } catch (error) {
            mainLogger.debug(`Произошла ошибка отвязывания сделки`);
            errorHandlingByType(error);
        }
    }

    async linkDeal(appUserId: number, deal: DealInterface, groupId: number, groupName: string, botToken: string): Promise<void> {
        try {

            const linkedDeal = await this.getLinkedDealByAppUserId(appUserId);

            if (!linkedDeal) {
                await LinkedDealsModel.insertMany({
                    widgetUserId: appUserId,
                    linkedGroups: []
                });
            }

            const linkedDeals: LinkedDealsInterface | null = await this.getLinkedDealByAppUserId(appUserId) || null;

            const linkedGroups = linkedDeals?.linkedGroups.map((group) => {
                if (group.telegramGroupId === groupId && !group.deals.some(lead => lead.id === deal.id)) {
                    return {
                        telegramBotToken: botToken,
                        telegramGroupId: groupId,
                        telegramGroupName: groupName,
                        deals: [...group.deals, deal]
                    };
                }
                return group;
            }) || [];

            if (linkedGroups.length) {
                await LinkedDealsModel.updateOne({ widgetUserId: appUserId }, {
                    $set: {
                        linkedGroups: linkedGroups.find((group) => group.telegramGroupId === groupId) ? linkedGroups : [...linkedGroups, {
                            telegramBotToken: botToken,
                            telegramGroupId: groupId,
                            telegramGroupName: groupName,
                            deals: [deal]
                        }]
                    }
                });
            } else {
                await LinkedDealsModel.updateOne({ widgetUserId: appUserId }, {
                    $set: {
                        linkedGroups: [...linkedGroups, {
                            telegramBotToken: botToken,
                            telegramGroupId: groupId,
                            telegramGroupName: groupName,
                            deals: [deal]
                        }]
                    }
                });
            }

        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во привязки сделки к группе!`);
            errorHandlingByType(error);
        }
    }

    async getLinkedDealByTelegramId(telegramId: number): Promise<LinkedGroups | null | void> {
        try {
            const linkedDeal: LinkedDealsInterface | null = await LinkedDealsModel.findOne({ 'linkedGroups.telegramGroupId': telegramId });

            if (linkedDeal) {
                return linkedDeal.linkedGroups.find((linkedGroup) => linkedGroup.telegramGroupId === telegramId);
            }

        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во время поиска связанных сделок!`);
            errorHandlingByType(error);
        }
        return null;
    }

    async getContactByTelegramId(telegramId: number): Promise<LinkedContact | null> {
        try {
            const contact: LinkedContact | null = await LinkedContactsModel.findOne({ 'linkedContact.telegramUserId': telegramId });
            if (contact) {
                return contact;
            }
        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во привязки сделки к группе!`);
            errorHandlingByType(error);
        }
        return null;
    }

    async linkContact(appUserId: number, amoCRMContactId: number, telegramUserId: number, telegramName: string): Promise<void> {
        try {
            const linkedContacts = await this.getLinkedContactsByAppUserId(appUserId);

            const linkedContact = {
                amoCRMContactId,
                telegramUserId,
                telegramName
            };
            await LinkedContactsModel.updateOne({ widgetUserId: appUserId }, {
                $set: {
                    linkedContact: [...linkedContacts?.linkedContact || [], linkedContact]
                }
            });
        } catch (error: unknown) {
            mainLogger.debug(`Произошла ошибка во привязки контакта!`);
            errorHandlingByType(error);
        }
    }
}

export default new ManagerMongoDB();
