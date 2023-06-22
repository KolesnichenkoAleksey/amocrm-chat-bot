import { Bot } from '../components/bot/Bot';
import { mainLogger } from '../components/logger/logger';
import { errorHandlingByType } from '../error/errorHandlingByType';
import { BotState } from '../@types/bot/State';

class BotsState {

    private bots: BotState[];

    constructor() {
        this.bots = [];
    }

    getBots(): BotState[] {
        return this.bots;
    };

    setBots(bots: BotState[]): void {
        this.bots = bots;
    };

    initializeBots(botTokens: string[]): this {

        botTokens.forEach((botToken: string) => {
            this.bots.push({ botToken });
        });

        this.bots = this.bots.map((bot) => {
            return {
                botToken: bot.botToken,
                botInstance: new Bot(bot.botToken)
            };
        });

        return this;
    };

    launchInitializedBots(): void {
        try {
            this.bots.forEach((bot: BotState) => {
                if (bot.botInstance instanceof Bot) {
                    bot.botInstance
                        .startListeners()
                        .launchInstance()
                        .then();

                    mainLogger.debug(`Bot with token ${bot.botInstance.getBotToken()} has been started`);
                }
            });
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    };

    getBotByToken(botToken: string): BotState | null {
        return this.bots.find(bot => bot.botToken === botToken) || null
    }

}

export default new BotsState();