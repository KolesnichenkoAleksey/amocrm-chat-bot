import { StatusCodes } from '../../consts/statusCodes';
import dotenv from 'dotenv';
import path from 'node:path';
import axios from 'axios';
import fs from 'node:fs';
import axiosRetry from 'axios-retry';
import log4js from 'log4js';
import { getUserLogger } from '../../components/logger/logger';
import { AccountSettings } from '../../@types/amo/accountSettings/accountSettings';

dotenv.config();

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';

class Api {
    AMO_TOKEN_PATH: string;
    LIMIT: number;
    ROOT_PATH: string;
    access_token: string;
    refresh_token: string;
    subDomain: string;
    logger: log4js.Logger;
    code: string;

    constructor(subDomain: string, code: string = '') {
        this.subDomain = subDomain;
        this.AMO_TOKEN_PATH = path.resolve(__dirname, '..', '..', 'authclients', `${this.subDomain}_amo_token.json`);
        this.LIMIT = 200;
        this.ROOT_PATH = `https://${this.subDomain}.amocrm.ru`;
        this.access_token = '';
        this.refresh_token = '';
        this.logger = getUserLogger(this.subDomain);
        this.code = code;
    }

    authChecker = <T extends unknown[], D>(request: (...args: T) => Promise<D>) => {
        return async (...args: T): Promise<D> => {
            if (!this.access_token) {
                return this.getAccessToken().then(() => this.authChecker(request)(...args));
            }
            return request(...args).catch((err) => {
                this.logger.error(err.response);
                this.logger.error(err);
                this.logger.error(err.response.data);
                const data = err.response.data;
                if ('validation-errors' in data) {
                    this.logger.error('args', JSON.stringify(args, null, 2));
                }
                if (data.status == StatusCodes.Unauthorized.Code && data.title === StatusCodes.Unauthorized.DefaultMessage) {
                    this.logger.debug('Нужно обновить токен');
                    return this.refreshToken().then(() => this.authChecker(request)(...args));
                }
                throw err;
            });
        };
    };

    requestAccessToken = async () => {
        return axios
            .post(`${this.ROOT_PATH}/oauth2/access_token`, {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: this.code,
                redirect_uri: REDIRECT_URI
            })
            .then((res) => {
                this.logger.debug('Свежий токен получен');
                return res.data;
            })
            .catch((err) => {
                this.logger.error(err.response.data);
                throw err;
            });
    };

    async getAccessToken() {
        if (this.access_token) {
            return Promise.resolve(this.access_token);
        }
        try {
            const content = fs.readFileSync(this.AMO_TOKEN_PATH).toString();
            const token = JSON.parse(content);
            this.access_token = token.access_token;
            this.refresh_token = token.refresh_token;
            return Promise.resolve(token);
        } catch (error) {
            this.logger.error(`Ошибка при чтении файла ${this.AMO_TOKEN_PATH}`, error);
            this.logger.debug('Попытка заново получить токен');
            const token: any = await this.requestAccessToken();
            fs.writeFileSync(this.AMO_TOKEN_PATH, JSON.stringify(token));
            this.access_token = token.access_token;
            this.refresh_token = token.refresh_token;
            return Promise.resolve(token);
        }
    }

    async refreshToken() {
        return axios
            .post(`${this.ROOT_PATH}/oauth2/access_token`, {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: this.refresh_token,
                redirect_uri: REDIRECT_URI
            })
            .then((res) => {
                this.logger.debug('Токен успешно обновлен');
                const token = res.data;
                fs.writeFileSync(this.AMO_TOKEN_PATH, JSON.stringify(token));
                this.access_token = token.access_token;
                this.refresh_token = token.refresh_token;
                return token;
            })
            .catch((err) => {
                this.logger.error('Не удалось обновить токен');
                this.logger.error(err.response.data);
            });
    }

    getAccountData = this.authChecker((): Promise<void | AccountSettings> => {
        return axios.get<AccountSettings>(`${this.ROOT_PATH}/api/v4/account`, {
            headers: {
                Authorization: `Bearer ${this.access_token}`
            }
        })
            .then((res) => res.data)
            .catch((err) => {
                this.logger.error('Не удалось получить информацию об аккаунте!');
                this.logger.error(err.response.data);
            });
    });
}

export default Api;