export interface IAddBot {
    subdomain: string,
    botToken: string,
    pipelineId: number,
}

export interface IDelBots {
    subdomain: string,
    botTokens: string[],
}

export interface IGetBots {
    subdomain: string,
}

export interface IRejectOptions {
    rejectValue: string
}