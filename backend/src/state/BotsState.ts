import { Bot } from '../components/bot/Bot';
import { mainLogger } from '../components/logger/logger';

class BotsState {

    private botTokens: string[];
    private readonly botInstances: Bot[];

    constructor() {
        this.botTokens = [];
        this.botInstances = [];
    }

    initializeBots = (botTokens: string[]) => {

        this.botTokens = botTokens;

        this.botTokens.forEach((botToken) => {
            this.botInstances.push(new Bot(botToken));
        });

        return this;
    };

    launchInitializedBots = () => {
        try {
            for (const botInstance of this.botInstances) {
                botInstance
                    .startListeners()
                    .launchInstance()
                    .then();
                mainLogger.debug(`Bot with token ${botInstance.getBotToken()} has been started`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                mainLogger.debug(error.message);
            }
            if (typeof error === 'string') {
                mainLogger.debug(error);
            }
        }
    };

}

export default new BotsState();