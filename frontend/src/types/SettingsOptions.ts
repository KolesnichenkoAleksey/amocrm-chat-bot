export enum SettingsOptionsId {
    payment = 'reon_payment',
    user =  'reon_main_settings',
}

export const options = [
    {
        id: SettingsOptionsId.user,
        title: 'Настройки'
    },
    {
        id: SettingsOptionsId.payment,
        title: 'Подписка'
    }
] as const;

export type OptionsType = typeof options
export type OptionT = OptionsType[number]