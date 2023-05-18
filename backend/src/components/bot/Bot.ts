import { Context, Telegraf } from 'telegraf';
import { BotListeners } from './BotListeners';
import { mainLogger } from '../logger/logger';

export class Bot {

    private readonly botInstance: Telegraf;

    constructor(botToken: string) {
        this.botInstance = new Telegraf<Context>(botToken);
    }

    getBotToken = () => {
        return this.botInstance.telegram.token
    }

    launchInstance = async () => {
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

    startListeners = () => {
        new BotListeners(this.botInstance);
        return this;
    };

}