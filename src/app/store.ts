import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { transactionsApi } from "../features/transactions/api/transactionsApi";
import { authApi } from "../features/authentication/api/authApi";
import { categoriesApi } from "../features/transactions/category/api/categoriesApi";
import { currenciesApi } from "../features/transactions/currency/api/currenciesApi";
import { paymentMethodsApi } from "../features/transactions/paymentMethods/api/paymentMethodsApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [transactionsApi.reducerPath]: transactionsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [currenciesApi.reducerPath]: currenciesApi.reducer,
  [paymentMethodsApi.reducerPath]: paymentMethodsApi.reducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(currenciesApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(paymentMethodsApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
