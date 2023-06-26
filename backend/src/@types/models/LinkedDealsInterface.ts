export interface DealInterface {
    name: string,
    id: number
}

export interface LastMessageFromAMOInterface {
    time: number,
    senderId: string,
    text: string
}

export type LinkedGroup = {
    telegramBotToken: string,
    telegramGroupId: number,
    telegramGroupName: string,
    deals: DealInterface[],
    amoChatIds: string[],
    lastMessageFromAMO?: LastMessageFromAMOInterface
}

export interface LinkedDealsInterface {
    widgetUserId: number,
    linkedGroups: LinkedGroup[]
}