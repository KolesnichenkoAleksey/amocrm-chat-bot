import { Context, Telegraf } from 'telegraf';

export class BotListeners {

    constructor(botInstance: Telegraf) {
        this.defineListeners(botInstance);
    }

    defineListeners = (botInstance: Telegraf) => {
        botInstance.on('text', this.reply);
    };

    private reply = (ctx: Context) => {
        return ctx.reply('Hello world!');
    };

}
