import { RootState } from '../index';

export const getBots = (state:RootState) => state.bots.bots;
export const getIsBotsLoading = (state:RootState) => state.bots.isLoading;
export const getBotError = (state:RootState) => state.bots.error;
