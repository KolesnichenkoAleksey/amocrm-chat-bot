import { TypedRequestBody, TypedRequestQuery } from './CustomRequest';

export type TypedRequestInstallWidget = TypedRequestQuery<{
    code: string;
    referer: string;
    platform: string;
    client_id: string;
    from_widget: string;
}>

export type TypedRequestDeleteWidget = TypedRequestQuery<{
    client_uuid: string;
    account_id: string;
}>

export type TypedRequestStatus = TypedRequestQuery<{
    subdomain: string
}>
