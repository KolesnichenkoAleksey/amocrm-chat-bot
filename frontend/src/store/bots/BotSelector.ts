import { RootState } from '../index';

export const getBots = (state:RootState) => state.bots.bots;
export const getIsBotsLoading = (state:RootState) => state.bots.isBotsLoading;
export const getIsBotAdding = (state:RootState) => state.bots.isBotAdding;
export const getIsBotsDeleting = (state:RootState) => state.bots.isBotsDeleting;
export const getBotError = (state:RootState) => state.bots.error;
