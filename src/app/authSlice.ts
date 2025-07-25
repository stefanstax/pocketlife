import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaymentMethod } from "../features/transactions/paymentMethods/types/paymentMethodsTypes";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  currencies: string[];
  passcode: string;
  securityName: string;
  recoveryUrl: string;
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
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
