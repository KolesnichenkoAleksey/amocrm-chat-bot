import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import AmoConstantSlice from './amo-constants/AmoConstantSlice';
import BotSlice from './bots/BotSlice';


const rootReducer = combineReducers({
  bots: BotSlice,
  amoConstants: AmoConstantSlice,
})

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
