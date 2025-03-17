'use client'

import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  amount: number;
}

export const counterInitialState: CounterState = {
  value: 0,
  amount: 1,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: counterInitialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    increase: (state) => {
      state.value += state.amount;
    },
    decrease: (state) => {
      state.value -= state.amount;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { setAmount, increase, decrease, reset } = counterSlice.actions;

export default counterSlice.reducer;
