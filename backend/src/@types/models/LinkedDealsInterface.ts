export type LinkedGroups = {
    telegramBotToken: string,
    telegramGroupId: number,
    dealsIds: number[]
}

export interface LinkedDealsInterface {
    widgetUserId: number,
    linkedGroups: LinkedGroups[]
}