import { Context, Scenes, session, Telegraf } from 'telegraf';
import { BotListeners } from './BotListeners';
import { mainLogger } from '../logger/logger';
import { linkedDealWizard } from './scenes/wizard/linkedDeal.wizard';

export class Bot {

    private readonly botInstance: Telegraf<Scenes.WizardContext>;
    scenes = new Scenes.Stage([linkedDealWizard]);

    constructor(botToken: string) {
        this.botInstance = new Telegraf<Scenes.WizardContext>(botToken);
        this.botInstance.use(session())
        this.botInstance.use(this.scenes.middleware());
    }

    getBotToken(): string {
        return this.botInstance.telegram.token;
    };

    async launchInstance(): Promise<void> {
        try {
            await this.botInstance.launch();
        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
            }
            if (typeof error === 'string') {
                mainLogger.debug(error);
            }
        }
    };

    startListeners(): Bot {
        const botListeners = new BotListeners(this.botInstance);
        return this;
    };

    async sendMessage(chatId: number, text: string): Promise<void> {
        try {
            await this.botInstance.telegram.sendMessage(chatId, text)
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