export type LinkedContact = {
    amoCRMContactId: number,
    telegramUserId: number,
    telegramName: string,
}

export interface LinkedContactsInterface {
    widgetUserId: number,
    linkedContact: LinkedContact[]
}