import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Budget } from "../paymentMethodsTypes";

interface BudgetState {
  budgets: Budget[];
}

const initialState: BudgetState = {
  budgets: [],
};

const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    getBudgets(state) {
      state.budgets;
    },
    setBudgets(state, action: PayloadAction<Budget[]>) {
      state.budgets = action.payload;
    },
    addAmount(
      state,
      action: PayloadAction<{
        budgetId: string;
        currencyId: string;
        amount: number | "";
      }>
    ) {
      const budget = state.budgets.find(
        (budget) =>
          budget.id === action.payload.budgetId &&
          budget.currencyId === action.payload.currencyId
      );
      if (budget) {
        budget.amount += +action.payload.amount;
      }
    },
    substractAmount(
      state,
      action: PayloadAction<{
        budgetId: string;
        currencyId: string;
        amount: number;
      }>
    ) {
      const budget = state.budgets.find(
        (budget) =>
          budget?.id === action.payload.budgetId &&
          budget.currencyId === action.payload.currencyId
      );

      if (budget) {
        budget.amount -= action.payload.amount;
      }
    },
  },
});

export const { setBudgets, addAmount, substractAmount } = budgetsSlice.actions;
export default budgetsSlice.reducer;
