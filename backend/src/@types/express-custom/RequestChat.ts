import { TypedRequestBody, TypedRequestQuery } from './CustomRequest';

export type TypedRequestConnectChat = TypedRequestQuery<{
    subdomain: string,
    accountId: string
}>
