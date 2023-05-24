type InitializingBots = {
    botToken: string;
    botName: string;
}

export interface UserInterface {
    widgetUserSubdomain: string;
    accountId: number;
    authCode: string;
    paid: boolean;
    installed: boolean;
    testPeriod: boolean;
    startUsingDate: string;
    finishUsingDate: string;
    initializingBots: InitializingBots[]
}