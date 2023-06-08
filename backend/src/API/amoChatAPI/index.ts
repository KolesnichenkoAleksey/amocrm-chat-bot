import dotenv from 'dotenv';
import path from 'node:path';
import MD5 from 'crypto-js/md5';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import axios from 'axios';
import { errorHandlingByType } from '../../error/errorHandlingByType';
import {
    ChatApiConnectBody,
    ChatApiConnectResponse,
    ChatApiDisconnectBody,
    ChatApiHeaders,
    ChatApiSendMessageBody
} from '../../@types/amo/chat-api/amo-chat-api.types';
import utils from '../../components/utils/Utils';

dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', `${process.env.NODE_ENV}.env`)
});

const SECOND_IN_MILLISECONDS = 1000;

function createSendMessageBody(groupId: number, userId: number, text: string): ChatApiSendMessageBody {

    const currentDateInTimeStamp = dayjs().unix();

    return {
        'event_type': 'new_message',
        'payload': {
            'timestamp': currentDateInTimeStamp,
            'msec_timestamp': currentDateInTimeStamp * SECOND_IN_MILLISECONDS,
            'msgid': `reon-${uuidv4()}`,
            'conversation_id': `reon-${utils.hashFunction(String(groupId))}`,
            'sender': {
                'id': `reon-${utils.hashFunction(String(userId) + String(groupId))}`
            },
            'message': {
                'type': 'text',
                'text': text
            },
            'silent': false
        }
    };
}

function createChatBody(groupId: number, userId: number) {

    return {
        'conversation_id': `reon-${utils.hashFunction(String(groupId))}`,
        'user': {
            'id': `reon-${utils.hashFunction(String(userId))}`,
            'avatar': 'https://example.com/users/avatar.png',
            'name': 'Example Client',
            'profile': {
                'phone': '79151112233',
                'email': 'example.client@example.com'
            },
            'profile_link': 'https://example.com/profile/example.client'
        }
    };
}

class AmoChatAPI {
    private REQ_URL: string = 'https://amojo.amocrm.ru';
    private readonly CHAT_CHANNEL_ID: string;
    private readonly CHAT_CHANNEL_SECRET: string;
    private readonly CHAT_CHANNEL_NAME: string;
    private HOOK_API_VERSION: string = 'v2';

    constructor() {
        this.CHAT_CHANNEL_ID = process.env.CHAT_CHANNEL_ID || '';
        this.CHAT_CHANNEL_SECRET = process.env.CHAT_CHANNEL_SECRET || '';
        this.CHAT_CHANNEL_NAME = process.env.CHAT_CHANNEL_NAME || '';
    }

    getHeaders(method: string, path: string, requestBody: object): ChatApiHeaders {

        const checkSum = String(MD5(JSON.stringify(requestBody)));

        const dateRfc = dayjs().format('ddd, DD MMM YYYY H:mm:ss Z');

        const signature = [method.toUpperCase(), checkSum, 'application/json', dateRfc, path].join('\n');

        const hashedSignature = String(HmacSHA1(signature, this.CHAT_CHANNEL_SECRET));

        return {
            'Date': dateRfc,
            'Content-Type': 'application/json',
            'Content-MD5': checkSum.toLowerCase(),
            'X-Signature': hashedSignature
        };

    }

    async connect(accountId: string): Promise<ChatApiConnectResponse | undefined> {
        try {
            const connectBody: ChatApiConnectBody = {
                'account_id': accountId,
                'title': this.CHAT_CHANNEL_NAME,
                'hook_api_version': this.HOOK_API_VERSION
            };

            const response = await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${this.CHAT_CHANNEL_ID}/connect`,
                { ...connectBody },
                { headers: this.getHeaders('post', `/v2/origin/custom/${this.CHAT_CHANNEL_ID}/connect`, connectBody) }
            );

            return response.data;

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    async disconnect(accountId: string): Promise<void> {
        try {
            const disconnectBody: ChatApiDisconnectBody = {
                'account_id': accountId
            };

            await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${this.CHAT_CHANNEL_ID}/disconnect`,
                { ...disconnectBody },
                { headers: this.getHeaders('post', `/v2/origin/custom/${this.CHAT_CHANNEL_ID}/disconnect`, disconnectBody) }
            );

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    async sendMessage(scopeId: string, userId: number, groupId: number, text: string): Promise<void> {
        try {
            const sendMessageBody = createSendMessageBody(userId, groupId, text);

            await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${scopeId}`,
                { ...sendMessageBody },
                { headers: this.getHeaders('post', `/v2/origin/custom/${scopeId}`, sendMessageBody) }
            );
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    async createChat(scopeId: string, userId: number, groupId: number, text: string): Promise<void> {
        try {
            const sendMessageBody = createChatBody(userId, groupId);

            console.log(await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${scopeId}/chats`,
                { ...sendMessageBody },
                { headers: this.getHeaders('post', `/v2/origin/custom/${scopeId}/chats`, sendMessageBody) }
            ));

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

}

export default new AmoChatAPI();