export interface DealInterface {
    name: string,
    id: number
}

export type LinkedGroups = {
    telegramBotToken: string,
    telegramGroupId: number,
    deals: DealInterface[]
    telegramGroupName: string,
}

export interface LinkedDealsInterface {
    widgetUserId: number,
    linkedGroups: LinkedGroups[]
}