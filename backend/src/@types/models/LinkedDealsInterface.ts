export interface DealInterface {
    name: string,
    id: number
}

export type LinkedGroup = {
    telegramBotToken: string,
    telegramGroupId: number,
    telegramGroupName: string,
    deals: DealInterface[]
    amoChatIds: string[]
}

export interface LinkedDealsInterface {
    widgetUserId: number,
    linkedGroups: LinkedGroup[]
}