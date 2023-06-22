import { v4 as uuidv4 } from 'uuid';

export type ChatApiHeaders = {
    'Date': string,
    'Content-Type': string,
    'Content-MD5': string,
    'X-Signature': string
}

export type ChatApiConnectResponse = {
    "account_id": string,
    "scope_id": string,
    "title": string,
    "hook_api_version": string
}

export type ChatApiConnectBody = {
    'account_id': string,
    'title': string,
    'hook_api_version': string
}

export type ChatApiDisconnectBody = {
    'account_id': string
}

type SendMessagePayloadSender = {
    'id': string,
    'avatar': string,
    'profile': object,
    'profile_link': string,
    'name': string
}

type SendMessagePayloadMessage = {
    'type': string,
    'text': string
}

type SendMessagePayload = {
    'timestamp': number,
    'msec_timestamp': number,
    'msgid': string,
    'conversation_id': string,
    'sender': SendMessagePayloadSender,
    'message': SendMessagePayloadMessage,
    'silent': boolean
}

export type ChatApiSendMessageBody = {
    'event_type': string,
    'payload': SendMessagePayload
}

//=================================================================================
//=================================================================================
//=================================================================================

export type ChatApiSource = {
    'external_id': string
}

export type ChatApiCreateChatBody = {
    'conversation_id': string,
    'source': ChatApiSource,
    'user': SendMessagePayloadSender
}

export type ChatApiNewChat = {
    'id': string,
    'user': SendMessagePayloadSender
}