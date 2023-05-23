import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IBot from './../../types/Bot';
import IPipeline from './../../types/Pipeline';


interface BotState {
    bots: IBot[];
}

const initState: BotState = {
    bots: [
        {
            _id: 23474567234,
            name: 'TestBotName',
            apiKey: 'jhsd234jjhdsf3',
            pipeline: {
                id: 6804418,
                name: 'Воронка'
            },
            relatedTgGroups: [
                {
                    name: 'Tg group 1',
                    leads: [
                        {
                            name: 'lead 1',
                            id: 123434534645,
                        },
                        {
                            name: 'lead 2',
                            id: 324893457834
                        }
                    ]
                },
                {
                    name: 'Tg group 2',
                    leads: [
                        {
                            name: 'lead 1234',
                            id: 123434534645,
                        },
                        {
                            name: 'lead 2783',
                            id: 324893457834
                        }
                    ]
                }
            ]
        },
        {
            _id: 37485834783,
            name: 'bot 2',
            apiKey: 'jhsd2sdfdsfg34jjhdsf3',
            pipeline: {
                id: 6804418,
                name: 'Воронка'
            },
            relatedTgGroups: [
                {
                    name: 'test2',
                    leads: [
                        {
                            name: 'lead 234223',
                            id: 123433755,
                        },
                        {
                            name: 'lead 467845',
                            id: 325743234
                        }
                    ]
                },
                {
                    name: 'Tsdfsd 2',
                    leads: [
                        {
                            name: 'lead 1234',
                            id: 123443345,
                        },
                        {
                            name: 'lead 2783',
                            id: 3222234
                        },
                        {
                            name: 'lead 165',
                            id: 1433453345,
                        }
                        
                    ]
                }
            ]
        }
    ]
}

export const botSlice = createSlice({
    name: 'bots',
    initialState: initState,
    reducers: {
        setBots(state, action: PayloadAction<IBot[]>) {
            state.bots = action.payload;
        },
        addBot(state, action: PayloadAction<IBot>) {
            state.bots.push(action.payload);
        },
        delBotById(state, action: PayloadAction<number>) {
            state.bots = state.bots.filter(bot => bot._id !== action.payload)
        },
        delBotsById(state, action: PayloadAction<number[]>) {
            state.bots = state.bots.filter(bot => !action.payload.includes(bot._id))
        },
        editBotPipeline(state, action: PayloadAction<{botId: number, pipeline:IPipeline}>) {
            const index = state.bots.findIndex(bot => bot._id === action.payload.botId)
            if (index !== -1) {
                state.bots[index].pipeline = action.payload.pipeline
            }
        }
    }
})

export const { setBots, addBot, delBotById, delBotsById, editBotPipeline } = botSlice.actions;

export default botSlice.reducer;