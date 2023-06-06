export interface PipelineInterface {
    id: number,
    name: string,
}

export type InitializingBot = {
    botToken: string;
    botName: string;
    pipeline: PipelineInterface;
}

export interface UserInterface {
    widgetUserSubdomain: string;
    accountId: number;
    amojoId: string;
    amojoScopeId: string;
    paid: boolean;
    installed: boolean;
    testPeriod: boolean;
    startUsingDate: string;
    finishUsingDate: string;
    access_token: string;
    refresh_token: string;
    initializingBots: InitializingBot[]
}