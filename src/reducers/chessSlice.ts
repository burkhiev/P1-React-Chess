import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

import { Colors } from '../services/Colors';
import { RootState } from '../store';

const initialState = {
  currentStepColor: Colors.White,
};

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    switchColor({ currentStepColor }) {
      if (currentStepColor === Colors.White) {
        currentStepColor = Colors.Black;
      } else {
        currentStepColor = Colors.White;
      }
    },
  },
});

export default chessSlice.reducer;

export const { switchColor } = chessSlice.actions;
export const useChessSelector: TypedUseSelectorHook<RootState> = useSelector;
