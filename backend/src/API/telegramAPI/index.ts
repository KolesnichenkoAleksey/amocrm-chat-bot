import axios from 'axios';
import { mainLogger } from '../../components/logger/logger';
import { GetMeResponse } from '../../@types/telegram-api/telegram-api.types';

class TelegramAPI {
    async getMe(botToken: string): Promise<GetMeResponse | undefined> {
        try {
            const { data } = await axios.post(`https://api.telegram.org/bot${botToken}/getMe`, {});
            return data.result;
        } catch (error: unknown) {
            mainLogger.debug(`Не удалось получить информацию по боту - ${botToken}`);
            mainLogger.debug(error);
        }
    };
}

export default new TelegramAPI();