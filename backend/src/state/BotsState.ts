import { Bot } from '../components/bot/Bot';
import { mainLogger } from '../components/logger/logger';
import { errorHandlingByType } from '../error/errorHandlingByType';

class BotsState {

    private botTokens: string[];
    private botInstances: Bot[];

    constructor() {
        this.botTokens = [];
        this.botInstances = [];
    }

    initializeBots = (botTokens: string[]): BotsState => {

        this.botTokens = botTokens;

        this.botTokens.forEach((botToken) => {
            this.botInstances.push(new Bot(botToken));
        });

        return this;
    };

    launchInitializedBots = (): void => {
        try {
            this.botInstances.forEach((botInstance: Bot) => {
                botInstance
                    .startListeners()
                    .launchInstance()
                    .then();

                mainLogger.debug(`Bot with token ${botInstance.getBotToken()} has been started`);
            })
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    };

}

export default new BotsState();