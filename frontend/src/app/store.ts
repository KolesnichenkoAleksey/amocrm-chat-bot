import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import AmoConstantSlice from '../store/reducers/AmoConstantSlice';
import BotSlice from '../store/reducers/BotSlice';


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
