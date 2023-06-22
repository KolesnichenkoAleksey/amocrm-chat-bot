import { Context, Telegraf, Telegram } from 'telegraf';
import { BotListeners } from './BotListeners';
import { mainLogger } from '../logger/logger';

export class Bot {

    private readonly botInstance: Telegraf;

    constructor(botToken: string) {
        this.botInstance = new Telegraf<Context>(botToken);
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

    async sendMessage(chatId: number, text: string):Promise<void> {
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