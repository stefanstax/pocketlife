import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "./transactionTypes";

const initialState: Transaction[] = [];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transactionAdded(state, action: PayloadAction<Omit<Transaction, "id">>) {
      state.push({
        id: Math.floor(Math.random() * 100),
        ...action.payload,
      });
    },
  },
});

export const { transactionAdded } = transactionsSlice.actions;
export default transactionsSlice.reducer;
