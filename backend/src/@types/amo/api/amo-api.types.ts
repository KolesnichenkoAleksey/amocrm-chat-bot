export abstract class Api {
    abstract SUBDOMAIN: string;
    abstract ACCESS_TOKEN?: string;
    abstract REFRESH_TOKEN?: string;
    abstract ROOT_URL: string;
    abstract AUTH_URL: string;
    abstract AUTH_CODE: string | undefined;
    abstract ACCOUNT_ID: number | undefined;

    abstract requestAccessToken(): Promise<SuccessTokenResponse | void>;

    abstract getAccessToken(): Promise<string>;

    abstract refreshToken(): Promise<void>;

    protected abstract authChecker<T extends unknown[], D>(request: (...args: T) => Promise<D>): (...args: T) => Promise<D>;
}

export interface IParamsClientApi {
    subDomain: string;
    authCode?: string;
    accountId?: number;
}

export type SuccessTokenResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
};

export type AmoBodyError<T = { errors: unknown }> = {
    ['validation-errors']: T[];
    title: string;
    status: number;
};

type links = {
    self: {
        href: string;
    };
};

export type AmoAccount = {
    id: number;
    name: string;
    subdomain: string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    current_user_id: number;
    country: string;
    customers_mode: string;
    is_unsorted_on: boolean;
    is_loss_reason_enabled: boolean;
    is_helpbot_enabled: boolean;
    is_technical_account: boolean;
    contact_name_display_order: number;
    amojo_id: string;
    uuid: string;
    version: number;
};




