import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import $api from "../.."
import { IAddBot, IDelBots, IGetBots, IRejectOptions } from "../../../types/BotsApiService";
import IBot from './../../../types/Bot';

const TelegramBotServices = {
    addBot: createAsyncThunk<IBot, IAddBot, IRejectOptions>('/addBot', async ({subdomain, botToken, pipelineId}: IAddBot, {rejectWithValue}) => {
        try {
            const response = await $api.post('/addBot', {subdomain, botToken, pipelineId});
            return response.data.bot;
        } catch (err: unknown) {       
            const error = err as AxiosError; 
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            } else {
                return rejectWithValue('Unexpected error')
            }
        }  
    }),
    deleteBots: createAsyncThunk<string, IDelBots, IRejectOptions>('/deleteBot', async ({subdomain, botTokens}: IDelBots, {rejectWithValue}) => {
        try {
            const response = await $api.patch('/deleteBot', {subdomain, botTokens});
            return response.data.message;
        } catch (err: unknown) {
            const error = err as AxiosError; 
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            } else {
                return rejectWithValue('Unexpected error')
            }
        }  
    }),
    getBots: createAsyncThunk<IBot[], IGetBots, IRejectOptions>('/getBot', async ({subdomain}: IGetBots, {rejectWithValue}) => {
        try {
            const response = await $api.post('/getBots',{} ,{
                params: {
                    subdomain
                }
            });
            return response.data;
        } catch (err: unknown) {       
            const error = err as AxiosError; 
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            } else {
                return rejectWithValue('Unexpected error')
            }
        }        
    }),
}

export default TelegramBotServices