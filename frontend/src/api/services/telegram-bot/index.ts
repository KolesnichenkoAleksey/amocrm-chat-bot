import { createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../.."
import { IAddBot, IDelBots, IGetBots } from "../../../types/BotsApiService";
import IBot from './../../../types/Bot';

const TelegramBotServices = {
    addBot: createAsyncThunk<IBot, IAddBot, {rejectValue: string,}>('/addBot', async ({subdomain, botToken, pipelineId}: IAddBot, {rejectWithValue}) => {
        try {
            const response = await $api.post('/addBot', {subdomain, botToken, pipelineId});
            return response.data.bot;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }),
    deleteBots: createAsyncThunk<string, IDelBots, {rejectValue: string,}>('/deleteBot', async ({subdomain, botTokens}: IDelBots, {rejectWithValue}) => {
        try {
            const response = await $api.patch('/deleteBot', {subdomain, botTokens});
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }),
    getBots: createAsyncThunk<IBot[], IGetBots, {rejectValue: string,}>('/getBot', async ({subdomain}: IGetBots, {rejectWithValue}) => {
        try {
            const response = await $api.post('/getBots',{} ,{
                params: {
                    subdomain
                }
            });
            return response.data;
        } catch (error: any) {            
            return rejectWithValue(error.response.data.message || error.message);
        }        
    }),
}

export default TelegramBotServices