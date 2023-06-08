import { WizardContext, WizardScene } from 'telegraf/typings/scenes';
import { Markup, Scenes } from 'telegraf';
import mongoManager from '../../../mongo/MongoManager';
import { errorHandlingByType } from '../../../../error/errorHandlingByType';
import { LinkedGroups } from '../../../../@types/models/LinkedDealsInterface';

export const linkedDealWizard: WizardScene<WizardContext> = new Scenes.WizardScene(
    'linked-deal-wizard',
    async (wizardCtx: any) => {
        try {

            const telegramChatId = wizardCtx.update.callback_query.message.chat.id;

            const linkedDeals: LinkedGroups | null | void = await mongoManager.getLinkedDealByTelegramId(telegramChatId);

            if (!linkedDeals) {
                return wizardCtx.editMessageReplyMarkup('Нет связанных сделок!');
            }

            wizardCtx.editMessageText('Связанные сделки!', {
                ...Markup.inlineKeyboard(
                    linkedDeals.deals.map(({ id, name }) => {
                        return [Markup.button.callback(name, String(id))];
                    })
                )
            });

            return wizardCtx.wizard.next();
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }
);
