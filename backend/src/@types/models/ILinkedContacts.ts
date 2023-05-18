type linkedContact = {
    amoCRMContactId: number,
    telegramUserId: number,
    telegramName: string
}

export interface ILinkedContacts {
    widgetUserId: number,
    linkedContact: Array<linkedContact>
}