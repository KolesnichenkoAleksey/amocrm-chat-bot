import { Bot } from '../../components/bot/Bot';

export type BotState = {
    botToken: string;
    botInstance?: Bot
}