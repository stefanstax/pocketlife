import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaymentMethod } from "../features/transactions/paymentMethods/types/paymentMethodsTypes";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  recoveryUrl: string;
  securityName: string;
  currencies: string[];
  passcode: string;
  paymentMethods: PaymentMethod[];
}

export interface UserWithToken {
  token: string | null;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserWithToken>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserBudget: (
      state,
      action: PayloadAction<{
        budgetId: string;
        currencyId: string;
        amount: number;
        type: "ADD" | "SUBTRACT" | "SET";
      }>
    ) => {
      if (!state.user?.paymentMethods) return;

      for (const method of state.user.paymentMethods) {
        const budget = method.budgets.find(
          (b) =>
            b.id === action.payload.budgetId &&
            b.currencyId === action.payload.currencyId
        );

        if (!budget) continue;

        switch (action.payload.type) {
          case "ADD":
            budget.amount += action.payload.amount;
            break;
          case "SUBTRACT":
            budget.amount -= action.payload.amount;
            break;
          case "SET":
            budget.amount = action.payload.amount;
            break;
          default:
            console.warn("Unknown budget update type");
        }
        break;
      }
    },
  },
});

export const { loginSuccess, logout, updateUser, updateUserBudget } =
  authSlice.actions;
export default authSlice.reducer;
