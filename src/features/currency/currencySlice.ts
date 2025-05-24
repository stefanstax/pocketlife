import { createSlice } from "@reduxjs/toolkit";
import type { CurrencyState } from "./currencyTypes";

const initialState: CurrencyState = {
  code: "EUR",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});
