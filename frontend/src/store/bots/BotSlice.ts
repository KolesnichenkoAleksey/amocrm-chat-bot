import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IBot from '../../types/Bot';
import IPipeline from '../../types/Pipeline';


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
                            id: 23467523675,
                        },
                        {
                            name: 'lead 2',
                            id: 687586754689
                        }
                    ]
                },
                {
                    name: 'Tg group 2',
                    leads: [
                        {
                            name: 'lead 1234',
                            id: 885438435856,
                        },
                        {
                            name: 'lead 2783',
                            id: 645672343289
                        }
                    ]
                }
            ]
        },
        {
            _id: 37485834783,
            name: 'bot/ {2}]',
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
                            id: 236572364675,
                        },
                        {
                            name: 'lead 467845',
                            id: 654573675736
                        }
                    ]
                },
                {
                    name: 'Tsdfsd 2',
                    leads: [
                        {
                            name: 'lead 1234',
                            id: 5634675675,
                        },
                        {
                            name: 'lead 2783',
                            id: 3242435423
                        },
                        {
                            name: 'lead 165',
                            id: 5736487654,
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
            state.bots = state.bots.filter(bot => bot._id !== action.payload);
        },
        delBotsById(state, action: PayloadAction<number[]>) {
            state.bots = state.bots.filter(bot => !action.payload.includes(bot._id));
        },
        editBotPipeline(state, action: PayloadAction<{botId: number, pipeline:IPipeline}>) {
            const index = state.bots.findIndex(bot => bot._id === action.payload.botId);
            if (index !== -1) {
                state.bots[index].pipeline = action.payload.pipeline;
            }
        },
        unlinkLead(state, action: PayloadAction<{botId: number, leadId: number}>) {
            state.bots = state.bots.map(bot => {
                if (bot._id !== action.payload.botId) {                    
                    return bot;
                }
                bot.relatedTgGroups = bot.relatedTgGroups.map(group => {
                    group.leads = group.leads.filter(lead => lead.id !== action.payload.leadId)
                    return group;
                });                
                return bot;
            })

        }
    }
})

export const { setBots, addBot, delBotById, delBotsById, editBotPipeline, unlinkLead } = botSlice.actions;

export default botSlice.reducer;