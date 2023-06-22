import { TypedRequestBody, TypedRequestQuery } from './CustomRequest';
import { PipelineInterface } from '../models/UserInterface';

export type TypedRequestAddBot = TypedRequestBody<{
    accountId: number,
    botToken: string
    pipeline: PipelineInterface
}>

export type TypedRequestGetByAccountBot = TypedRequestQuery<{
    subdomain: string
}>

export type TypedRequestGetAllBot = TypedRequestQuery<{
    subdomain: string
}>

export type TypedRequestGetAllLinkedGroups = TypedRequestQuery<{
    subdomain: string
}>

export type TypedRequestDeleteBot = TypedRequestBody<{
    subdomain: string,
    botTokens: string[]
}>

// ===========================================================================
export type TypedRequestGetAllBotByAccountId = TypedRequestQuery<{
    accountId: number
}>

export type TypedRequestChangePipeline = TypedRequestBody<{
    accountId: number,
    botToken: string,
    pipeline: PipelineInterface
}>

export type TypedRequestUnlinkDeal = TypedRequestBody<{
    accountId: number,
    botToken: string,
    groupId: number,
    dealId: number
}>

export type TypeGetTgGroupNameByAmoContactId = TypedRequestBody<{
    accountId: number,
    amoContactId: number
}>
export type TypeGetDealTgGroupName = TypedRequestBody<{
    accountId: number,
    dealId: number
}>

export type TypeGetTgGroupNameByChatId = TypedRequestBody<{
    accountId: number,
    chatId: string
}>
// ===========================================================================