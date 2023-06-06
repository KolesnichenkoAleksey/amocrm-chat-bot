import axios, { AxiosRequestConfig } from 'axios';
import { mainLogger } from '../../components/logger/logger';


export const customRequest = async (url: string, params: AxiosRequestConfig<any>, success: string, error: string) => {
    return axios
        .get(url, {
            ...params
        })
        .then(() => {
            mainLogger.debug(`${success} ${params}`);
        })
        .catch(() => {
            mainLogger.debug(error);
        });
};