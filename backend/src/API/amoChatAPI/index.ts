import dotenv from 'dotenv';
import path from 'node:path';
import MD5 from 'crypto-js/md5';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import axios from 'axios';
import { errorHandlingByType } from '../../error/errorHandlingByType';

dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', `${process.env.NODE_ENV}.env`)
});

const SECOND_IN_MILLISECONDS = 1000;

const TELEGRAM_USER_SECRET_KEY = process.env.TELEGRAM_UUID_KEY || 'ac76cf21-d6d4-4344-91db-7e4ccbaef687';

function hashFunction(input: string) {
    return uuidv5(input, TELEGRAM_USER_SECRET_KEY);
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

    getHeaders(method: string, path: string, requestBody: object) {

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

    async connect(accountId: string) {
        try {
            const body = {
                'account_id': accountId,
                'title': this.CHAT_CHANNEL_NAME,
                'hook_api_version': this.HOOK_API_VERSION
            };

            const response = await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${this.CHAT_CHANNEL_ID}/connect`,
                { ...body },
                { headers: this.getHeaders('post', `/v2/origin/custom/${this.CHAT_CHANNEL_ID}/connect`, body) }
            );

            return response.data;

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    async disconnect(accountId: string) {
        try {
            const body = {
                'account_id': accountId
            };

            await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${this.CHAT_CHANNEL_ID}/disconnect`,
                { ...body },
                { headers: this.getHeaders('post', `/v2/origin/custom/${this.CHAT_CHANNEL_ID}/disconnect`, body) }
            );

        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

    async sendMessage(scopeId: string, userId: number, text: string) {
        try {

            const currentDateInTimeStamp = dayjs().unix();

            // это моковые данные
            const body = {
                'event_type': 'new_message',
                'payload': {
                    'timestamp': currentDateInTimeStamp,
                    'msec_timestamp': currentDateInTimeStamp * SECOND_IN_MILLISECONDS,
                    'msgid': `reon-${uuidv4()}`,
                    'conversation_id': `reon-${TELEGRAM_USER_SECRET_KEY}`,
                    'sender': {
                        'id': `reon-${hashFunction(String(userId))}`,
                        'avatar': 'https://example.com/users/avatar.png',
                        'profile': {
                            'phone': '+79151112233',
                            'email': 'example.client@example.com'
                        },
                        'profile_link': 'https://example.com/profile/example.client',
                        'name': 'Вася клиент'
                    },
                    'message': {
                        'type': 'text',
                        'text': text
                    },
                    'silent': false
                }
            };

            await axios.post(
                `${this.REQ_URL}/v2/origin/custom/${scopeId}`,
                { ...body },
                { headers: this.getHeaders('post', `/v2/origin/custom/${scopeId}`, body) }
            );
        } catch (error: unknown) {
            errorHandlingByType(error);
        }
    }

}

export default new AmoChatAPI();