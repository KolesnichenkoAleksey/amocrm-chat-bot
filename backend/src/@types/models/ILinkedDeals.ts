type linkedGroups = {
    telegramGroupId: number,
    dealsIds: Array<number>
}

export interface ILinkedDeals {
    widgetUserId: number,
    linkedGroups: Array<linkedGroups>
}