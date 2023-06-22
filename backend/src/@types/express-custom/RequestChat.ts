import { Request } from 'express';
import { TypedRequestQuery } from './CustomRequest';

export type TypedRequestConnectChat = TypedRequestQuery<{
    subdomain: string,
    accountId: string
}>



//=================================================================================
//=================================================================================
//=================================================================================
//=================================================================================

interface Conversation {
    id: string,
    client_id: string,
}

interface Source {
    id: string
}

interface Sender {
    id: string
}

interface Receiver {
    id: string,
    phone: string,
    email: string,
}

interface Button {
    text: string,
    url: string
} 

interface MurkUp {
    mode: string,
    buttons: Button[][]
}

interface TemplateParam {
    key: string,
    value: string
}

interface Template {
    id: number,
    external_id: string,
    content: string,
    params: TemplateParam[]
}

export type TypedRequestChatMessage = {
    conversation: Conversation,
    source: Source,
    sender: Sender,
    receiver: Receiver,
    timestamp: number,
    msec_timestamp: number,
    message: {
        id: string,
        type: string,
        text: string,
        tag: string,
        media: string,
        thumbnail: string,
        file_name: string,
        file_size: number,
        markup: MurkUp,
        template: Template,
        reply_to?: {
            message: Omit<TypedRequestChatMessage, 'message'>
        },
        forwards: {
            conversation_ref_id: string,
            messages: Omit<TypedRequestChatMessage, 'message'>
        },
    }
}

//====================================================================================
export type TypedRequestChatNewMessageBody = {
    accountId: string,
    time: number,
    message: TypedRequestChatMessage
}

export type TypedRequestChatNewMessageParams = {
    scope_id: string
}

export type TypedRequestChatNewMessage = Request<TypedRequestChatNewMessageParams, object, TypedRequestChatNewMessageBody, object>;