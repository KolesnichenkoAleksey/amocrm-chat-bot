import { Context, Telegraf } from 'telegraf';

export class BotListeners {

    constructor(botInstance: Telegraf) {
        this.defineListeners(botInstance);
    }

    // пока что это шаблон класса, управляющего слушателями событий внутри ботов, на данный момент это нужно для тестирования работоспособности в целом

    defineListeners(botInstance: Telegraf): void {
        botInstance.on('text', this.replyHello);
        botInstance.on('message', this.replyGoodBy);
    };

    private replyHello(ctx: Context) {
        return ctx.reply('Hello!');
    };

    private replyGoodBy(ctx: Context) {
        return ctx.reply('Goodbye!');
    };

}
