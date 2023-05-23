import { Context, Telegraf } from 'telegraf';
import { BotListeners } from './BotListeners';
import { mainLogger } from '../logger/logger';

export class Bot {

    private readonly botInstance: Telegraf;

    constructor(botToken: string) {
        this.botInstance = new Telegraf<Context>(botToken);
    }

    getBotToken = (): string => {
        return this.botInstance.telegram.token
    }

    launchInstance = async (): Promise<void> => {
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

    startListeners = (): Bot => {
        const botListeners = new BotListeners(this.botInstance);
        return this;
    };

}