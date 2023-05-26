import { TypedRequestBody, TypedRequestQuery } from './CustomRequest';

export type TypedRequestAddBot = TypedRequestBody<{
    subdomain: string,
    botToken: string
}>

export type TypedRequestGetByAccountBot = TypedRequestQuery<{
    subdomain: string
}>

export type TypedRequestGetAllBot = TypedRequestQuery<{
    subdomain: string
}>

export type TypedRequestDeleteBot = TypedRequestBody<{
    subdomain: string,
    botTokens: string[]
}>