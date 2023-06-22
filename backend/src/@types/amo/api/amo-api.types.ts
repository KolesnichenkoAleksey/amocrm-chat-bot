import {CatalogElement, Company, Contact, Tag} from "./embeddedEntities";
import {Customfield} from "./customField";

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

type lossReasonData = {
    id: number,
    name: string,
    sort: number,
    created_at: number,
    updated_at: number,
    _links: {
        self: {
            href: string
        }
    }
}

export type LeadData = {
    id?: number,
    name?: string,
    price?: number,
    responsible_user_id?: number,
    group_id?: number,
    status_id?: number,
    pipeline_id?: number,
    loss_reason_id?: number | null,
    created_by?: number,
    updated_by?: number,
    created_at?: number,
    updated_at?: number,
    closed_at?: number | null,
    closest_task_at?: null,
    is_deleted?: boolean,
    custom_fields_values?: Customfield[] | null,
    score?: number | null,
    source_id?: number | null,
    account_id?: number,
    labor_cost?: number | null,
    is_price_computed?: boolean,
    is_price_modified_by_robot?: boolean,
    _links?: {
        self: {
            href: string
        }
    }
    _embedded?: {
        loss_reason?: lossReasonData[] | null,
        tags?: Tag[] | null,
        contacts?: Contact[],
        companies?: Company[],
        catalog_elements?: CatalogElement[],
    }
}

export type CreatedContact = {
    name?: string,
    first_name?: string,
    last_name?: string,
    responsible_user_id?: number,
    created_by?: number,
    updated_by?: number,
    created_at?: number,
    updated_at?: number,
    custom_fields_values?: Customfield[] | null,
    _embedded?: {
        tags?: Tag[]
    },
    request_id?: string
}

type CreatedContactEmbedded = {
    id: number,
    is_deleted: boolean,
    is_unsorted: boolean,
    request_id: string,
    _links: {
        self: {
            href: string
        }
    }
}

export type CreatedContactResponse = {
    _links: {
        self: {
            href: string
        }
    },
    _embedded: { contacts: CreatedContactEmbedded[] }
}
