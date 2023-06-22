import dotenv from 'dotenv';
import path from 'node:path';
import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { getUserLogger } from '../../components/logger/logger';
import {
    AmoAccount,
    AmoBodyError,
    Api,
    IParamsClientApi,
    SuccessTokenResponse
} from '../../@types/amo/api/amo-api.types';
import { StatusCodes } from '../../consts/statusCodes';
import { TokenTypes } from '../../consts/TokenTypes';
import mongoManager from '../../components/mongo/MongoManager';
import { AmoChatSourceInterface, UserInterface } from '../../@types/models/UserInterface';
import dayjs from 'dayjs';
import { Logger } from 'log4js';
import amoChatAPI from '../amoChatAPI';
import { v4 as uuidv4 } from 'uuid';


dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', `${process.env.NODE_ENV}.env`)
});

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';

class ClientApi extends Api {
    ACCOUNT_ID: number | undefined;
    AMOJO_ID: string = '';
    SUBDOMAIN: string;
    ACCESS_TOKEN?: string;
    REFRESH_TOKEN?: string;
    ROOT_URL: string;
    AUTH_URL: string;
    AUTH_CODE: string | undefined;
    logger: Logger;
    unAuthCode: number;
    unAuthStatus: string;

    constructor({ subDomain, authCode, accountId }: IParamsClientApi) {
        super();
        this.SUBDOMAIN = subDomain;
        this.AUTH_CODE = authCode;
        this.ACCOUNT_ID = accountId;
        this.ROOT_URL = `https://${this.SUBDOMAIN}.amocrm.ru`;
        this.AUTH_URL = `${this.ROOT_URL}/oauth2/access_token`;
        this.logger = getUserLogger(this.SUBDOMAIN);
        this.unAuthCode = StatusCodes.Unauthorized.Code;
        this.unAuthStatus = StatusCodes.Unauthorized.DefaultMessage;
    }

    private getRequestTokenData(typeRequest: string) {
        const requestTokenData = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: typeRequest,
            redirect_uri: REDIRECT_URI
        };
        if (typeRequest === TokenTypes.refreshToken) {
            return {
                ...requestTokenData,
                refresh_token: this.REFRESH_TOKEN
            };
        }
        return {
            ...requestTokenData,
            code: this.AUTH_CODE
        };
    };

    async requestAccessToken<SuccessTokenResponse>(): Promise<SuccessTokenResponse | void> {
        return axios
            .post(
                `${this.ROOT_URL}/oauth2/access_token`,
                this.getRequestTokenData(TokenTypes.authCode)
            )
            .then((response: AxiosResponse<SuccessTokenResponse>) => {
                this.logger.debug(`Fresh token has been received`);
                return response.data;
            })
            .catch((err: AxiosError<AmoBodyError>) => {
                this.logger.error(
                    `ERROR: Error while request token`,
                    err.response ? err.response.data : {}
                );
            });
    };

    async getAccessToken() {
        if (this.ACCESS_TOKEN) {
            return Promise.resolve(this.ACCESS_TOKEN);
        }
        try {
            let account = null;
            if (this.ACCOUNT_ID) {
                this.logger.debug(`Try to get token by account id`);
                account = await mongoManager.getWidgetUserByAccountId(this.ACCOUNT_ID);
            } else {
                this.logger.debug(`Try to get token by subdomain`);
                account = await mongoManager.getWidgetUserBySubdomain(
                    this.SUBDOMAIN
                );
            }
            if (!account) {
                throw new Error('Account not found');
            }
            if (account.access_token && account.refresh_token) {
                this.logger.debug(`Received tokens`);
                this.ACCESS_TOKEN = account.access_token;
                this.REFRESH_TOKEN = account.refresh_token;
                return Promise.resolve(this.ACCESS_TOKEN);
            } else {
                throw new Error('no tokens');
            }
        } catch (error) {
            this.logger.error(error);
            this.logger.debug(`Try to get token again`);
            const token = await this.requestAccessToken<SuccessTokenResponse>();

            if (!token || !token.access_token || !token.refresh_token) {
                throw new Error('no tokens');
            }

            this.ACCESS_TOKEN = token.access_token;
            this.REFRESH_TOKEN = token.refresh_token;
            if (!this.ACCOUNT_ID) {
                const accountData = await this.getAccountData();
                this.ACCOUNT_ID = accountData.id;
                this.AMOJO_ID = accountData.amojo_id;
            }
            const account = await mongoManager.getWidgetUserByAccountId(Number(this.ACCOUNT_ID));

            const chatChannelData = await amoChatAPI.connect(this.AMOJO_ID);

            if (account) {
                const updatedAppUser: UserInterface = {
                    ...account,
                    amojoId: this.AMOJO_ID,
                    amojoScopeId: chatChannelData?.scope_id || '',
                    widgetUserSubdomain: this.SUBDOMAIN,
                    access_token: this.ACCESS_TOKEN,
                    refresh_token: this.REFRESH_TOKEN,
                    installed: true
                };

                await mongoManager.updateUser(updatedAppUser);
            } else {
                this.logger.debug(
                    `Account by id not found, create a new account`
                );
                const todayDate = dayjs();

                const newAppUser: UserInterface = {
                    widgetUserSubdomain: this.SUBDOMAIN,
                    accountId: Number(this.ACCOUNT_ID),
                    amojoId: this.AMOJO_ID,
                    amojoScopeId: chatChannelData?.scope_id || '',
                    access_token: this.ACCESS_TOKEN,
                    refresh_token: this.REFRESH_TOKEN,
                    paid: false,
                    installed: true,
                    testPeriod: true,
                    startUsingDate: todayDate.format('DD.MM.YYYY'),
                    finishUsingDate: todayDate.add(15, 'days').format('DD.MM.YYYY'),
                    initializingBots: []
                };

                await mongoManager.insertUser(newAppUser);
            }
            return Promise.resolve(this.ACCESS_TOKEN);
        }
    };

    async refreshToken() {
        try {
            const response = await axios.post<SuccessTokenResponse>(
                `${this.ROOT_URL}/oauth2/access_token`,
                this.getRequestTokenData('refresh_token')
            );
            this.logger.debug(`Token has been received`);
            const token = response.data;
            this.ACCESS_TOKEN = token.access_token;
            this.REFRESH_TOKEN = token.refresh_token;
            const account: UserInterface | null = await mongoManager.getWidgetUserByAccountId(
                Number(this.ACCOUNT_ID)
            );

            if (account) {
                await mongoManager.updateUser({
                    ...account,
                    access_token: String(this.ACCESS_TOKEN),
                    refresh_token: String(this.REFRESH_TOKEN)
                });
            }

        } catch (err) {
            if (err instanceof AxiosError) {
                const typedErr = err as AxiosError<AmoBodyError>;
                this.logger.error(
                    `ERROR: Error while refresh token`,
                    typedErr.response ? typedErr.response.data : {}
                );
            } else {
                this.logger.error(`ERROR: Error while refresh token`, err);
            }
        }
    };

    authChecker<T extends unknown[], D>(
        request: (...args: T) => Promise<D>
    ) {
        return async (...args: T): Promise<D> => {
            if (!this.ACCESS_TOKEN) {
                return this.getAccessToken().then(() =>
                    this.authChecker(request)(...args)
                );
            }
            return request(...args).catch(
                async (err: AxiosError<AmoBodyError>) => {
                    const errorBody = err.response ? err.response.data : null;
                    this.logger.error(err.response?.data);
                    console.log(err);
                    

                    if (errorBody && 'validation-errors' in errorBody) {
                        errorBody['validation-errors'].forEach((element) =>
                            this.logger.debug(element.errors)
                        );
                        this.logger.error(
                            'args',
                            JSON.stringify(args, null, 2)
                        );
                    }

                    if (
                        errorBody &&
                        errorBody.status === this.unAuthCode &&
                        errorBody.title === this.unAuthStatus
                    ) {
                        this.logger.debug('necessary to refresh token');
                        return await this.refreshToken().then(() =>
                            this.authChecker(request)(...args)
                        );
                    }
                    throw errorBody;
                }
            );
        };
    };

    getAccountData: () => Promise<AmoAccount> = this.authChecker(async () => {
        const res = await axios.get<AmoAccount>(
            `${this.ROOT_URL}/api/v4/account?with=amojo_id`,
            {
                headers: {
                    Authorization: `Bearer ${this.ACCESS_TOKEN}`
                }
            }
        );
        return res.data;
    });

    //================================================================================================
    //================================================================================================
    //================================================================================================
    //================================================================================================
    //================================================================================================
    //================================================================================================


    getDealName: (dealId: number) => Promise<string> = this.authChecker(async (dealId: number) => {
        const res = await axios.get(`${this.ROOT_URL}/api/v4/leads/${dealId}`, {
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`
            }
        })
        return res.data.name;
    })

    getSources: () => Promise<void> = this.authChecker(async () => {
        try {            
            const res = await axios.get(`${this.ROOT_URL}/api/v4/sources`, {
                headers: {
                    Authorization: `Bearer ${this.ACCESS_TOKEN}`
                }
            })
            console.log(res.data._embedded.sources);
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);         
            }
        }
    })

    addSource: (pipeline_id: number, botName: string) => Promise<AmoChatSourceInterface | null> = this.authChecker(async (pipeline_id: number, botName: string) => {
        try {
            const res = await axios.post(
                `${this.ROOT_URL}/api/v4/sources`,
                [{
                    name:`reon-tg-chat-${botName}`,
                    external_id: uuidv4(),
                    pipeline_id: pipeline_id,
                }],
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            );
            return res.data._embedded.sources[0];
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error adding source');
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);         
            }
        }
        return null;
    })

    editSource: (newSource: {id: number, pipeline_id: number}) => Promise<AmoChatSourceInterface | null> = this.authChecker(async (newSource: {id: number, pipeline_id: number}) => {
        try {
            const res = await axios.patch(
                `${this.ROOT_URL}/api/v4/sources`,
                [
                    newSource
                ],
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            );
            
            return res.data._embedded.sources[0];
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error editing source');
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);
            }
        }
        return null;
    })

    // delSource: (sourceId: number) => Promise<void> = this.authChecker(async (sourceId: number) => {
    //     try {
    //         await axios.delete(
    //             `${this.ROOT_URL}/api/v4/sources/${sourceId}`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${this.ACCESS_TOKEN}`
    //                 }
    //             }
    //         );
            
    //     } catch (error: unknown) {
    //         if (error instanceof AxiosError) {
    //             console.log('Error deleting source');
    //             console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);         
    //         }           
    //     }
    // })

    delSource: (sources: AmoChatSourceInterface[]) => Promise<void> = this.authChecker(async (sources: AmoChatSourceInterface[]) => {
        try {
            await axios.delete(
                `${this.ROOT_URL}/api/v4/sources`,
                {
                    data: sources.map(source => ({id: source.id})),
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            );

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error deleting source');
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);
            }
        }
    })

    createContact: (contactName: string) => Promise<number | null> = this.authChecker(async (contactName: string) => {
        try {
            const res = await axios.post(
                `${this.ROOT_URL}/api/v4/contacts`,
                [
                    {
                        name: contactName
                    }
                ],
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            )
            
            return res.data._embedded.contacts[0].id || null;
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error creating contact');
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);         
            }
            return null;
        }
    })

    linkContactToLead: (leadId: number, contactId: number) => Promise<void> = this.authChecker(async (leadId: number, contactId: number) => {
        try {
            await axios.post(
                `${this.ROOT_URL}/api/v4/leads/${leadId}/link`,
                [
                    {
                        to_entity_id: contactId,
                        to_entity_type: 'contacts'
                    }
                ],
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            );
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error linking contact to lead'); 
                console.log(error?.response?.data['validation-errors'][0].errors || error?.response?.data);         
            }          
        }
    })

    linkChatToContact: (chat_id: string, contact_id: number) => Promise<void> = this.authChecker(async (chat_id: string, contact_id: number) => {
        try {
            const res = await axios.post(
                `${this.ROOT_URL}/api/v4/contacts/chats`,
                [
                    {
                        contact_id,
                        chat_id,
                    }
                ],
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`
                    }
                }
            );
            // console.log(res.data?._embedded?.chats[0]);
            
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('Error linking chat to contact');
                console.log(error?.response?.data?.['validation-errors']?.[0]?.errors || error?.response?.data);         
            }          
        }
    })

}

export default ClientApi;