import { combineReducers, configureStore } from '@reduxjs/toolkit';

import chessReducer from './reducers/chessSlice';

const rootReducer = combineReducers({
  chessReducer,
});

const rootStore = configureStore({
  reducer: rootReducer,
});

export default rootStore;

// для типизации useSelector
export type RootState = ReturnType<typeof rootReducer>;

// ???
export type AppStore = typeof rootStore;

// для типизации dispatch
export type AppDispatch = AppStore['dispatch'];
