import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TelegramBotServices from "../../api/services/telegram-bot";
import IBot from '../../types/Bot';
import IPipeline from '../../types/Pipeline';


interface BotState {
    bots: IBot[];
    isLoading: {
        isGettingBots: boolean,
        isAddingBot: boolean,
        isDeletingBots: boolean,
    }
    error: {
        gettingBotsError: string,
        addingBotError: string,
        deletingBotsError: string,
    },
}

const initState: BotState = {
    isLoading: {
        isAddingBot: false,
        isDeletingBots: false, 
        isGettingBots: false,
    },
    error: {
        gettingBotsError: '',
        addingBotError: '',
        deletingBotsError: '',
    },
    bots: [
        {
            _id: '2347jhfgd234',
            botName: 'TestBotName',
            botToken: 'jhsd234jjhdsf3',
            pipeline: {
                id: 6804418,
                name: 'Воронка'
            },
            relatedTgGroups: [
                {
                    id: 1323339843,
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
                    id: 13255556243,
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
            _id: '3748sdfsd44783',
            botName: 'amocrm tg',
            botToken: 'jhsd2sdsdfdfds6534763jjhdsf3',
            pipeline: {
                id: 6804418,
                name: 'Воронка'
            },
            relatedTgGroups: [
                {
                    id: 1325783445843,
                    name: 'Doors sale',
                    leads: [
                        {
                            name: 'lead 232443',
                            id: 2362654474675,
                        },
                        {
                            name: 'lead 14345',
                            id: 6542344675736
                        }
                    ]
                },
                {
                    id: 13255892943,
                    name: 'Window Sale',
                    leads: [
                        {
                            name: 'lead 174534',
                            id: 5637893450075,
                        },
                        {
                            name: 'lead 254163',
                            id: 3243267785423
                        },
                        {
                            name: 'lead 1643675',
                            id: 5754318461654,
                        }
                    ]
                }
            ]
        },
        {
            _id: '374858hjlj83',
            botName: 'bot/ {2}]',
            botToken: 'jhsd2sdfdsfg34jjhdsf3',
            pipeline: {
                id: 6804418,
                name: 'Воронка'
            },
            relatedTgGroups: [
                {
                    id: 13257889843,
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
                    id: 13255892943,
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
    // {
    //     isBotsLoading: false,
    //     isBotAdding: false,
    //     isBotsDeleting: false,
    //     error: '',
    //     bots: [],
    // } as BotState,
    reducers: {
        setBots(state, action: PayloadAction<IBot[]>) {
            state.bots = action.payload;
        },
        addBot(state, action: PayloadAction<IBot>) {
            state.bots.push(action.payload);
        },
        delBotsByToken(state, action: PayloadAction<string[]>) {
            state.bots = state.bots.filter(bot => !action.payload.includes(bot.botToken));
        },
        editBotPipeline(state, action: PayloadAction<{botId: string, pipeline:IPipeline}>) {
            const index = state.bots.findIndex(bot => bot._id === action.payload.botId);
            if (index !== -1) {
                state.bots[index].pipeline = action.payload.pipeline;
            }
        },
        unlinkLead(state, action: PayloadAction<{botId: string, tgGroupId: number, leadId: number}>) {
            const selectedBot = state.bots.find(bot => bot._id === action.payload.botId);
            if (selectedBot) {
                const selectedTgGroup = selectedBot.relatedTgGroups.find(tgGroup => tgGroup.id === action.payload.tgGroupId);
                if (selectedTgGroup) {
                    selectedTgGroup.leads = selectedTgGroup.leads.filter(lead => lead.id !== action.payload.leadId);
                }
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase( TelegramBotServices.addBot.pending, (state) => {
                state.isLoading.isAddingBot = true;
            })
            .addCase( TelegramBotServices.addBot.fulfilled, (state, action) => {
                console.log(action.payload); 
                // ==========================================
                action.payload.relatedTgGroups = [];             
                // ==========================================
                state.bots.push(action.payload);
                state.error.addingBotError = '';
                state.isLoading.isAddingBot = false;
            })
            .addCase( TelegramBotServices.addBot.rejected, (state, action) => {
                console.log(action.payload);
                state.error.addingBotError = action.payload || 'error'
                state.isLoading.isAddingBot = false;
            })
            .addCase( TelegramBotServices.deleteBots.pending, (state) => {
                state.isLoading.isDeletingBots = true;
            })
            .addCase( TelegramBotServices.deleteBots.fulfilled, (state, action) => {
                state.bots = state.bots.filter(bot => !action.payload.includes(bot._id));
                state.error.deletingBotsError = '';
                state.isLoading.isDeletingBots = false;
            })
            .addCase( TelegramBotServices.deleteBots.rejected, (state, action) => {
                console.log(action.payload);
                state.error.deletingBotsError = action.payload || 'error'
                state.isLoading.isDeletingBots = false;
            })
            .addCase( TelegramBotServices.getBots.pending, (state) => {
                state.isLoading.isGettingBots = true;
            })
            .addCase( TelegramBotServices.getBots.fulfilled, (state, action) => {
                console.log(action.payload);
                state.bots = action.payload;
                // ==========================================
                state.bots.forEach(bot => bot.relatedTgGroups = []);
                // ==========================================
                state.error.gettingBotsError = '';
                state.isLoading.isGettingBots = false;
            })
            .addCase( TelegramBotServices.getBots.rejected, (state, action) => {
                console.log(action.payload);
                state.error.gettingBotsError = action.payload || 'error'
                state.isLoading.isGettingBots = false;
            })
    },
})

export const { setBots, addBot, delBotsByToken, editBotPipeline, unlinkLead } = botSlice.actions;

export default botSlice.reducer;