type LinkedGroups = {
    telegramGroupId: number,
    dealsIds: number[]
}

export interface LinkedDealsInterface {
    widgetUserId: number,
    linkedGroups: LinkedGroups[]
}