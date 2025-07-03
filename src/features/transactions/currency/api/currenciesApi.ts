import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CurrencyState } from "../currencyTypes";
import type { User } from "../../../../app/authSlice";
import type { RootState } from "../../../../app/store";

export const currenciesApi = createApi({
  reducerPath: "currenciesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyState[], void>({
      query: () => "currencies",
    }),
    getCurrencyById: builder.query<CurrencyState, string>({
      query: (id) => `currencies/${id}`,
    }),
    addCurrency: builder.mutation<CurrencyState, CurrencyState>({
      query: (data) => ({
        url: "currencies",
        method: "POST",
        body: data,
      }),
    }),
    editCurrencyById: builder.mutation<CurrencyState, CurrencyState>({
      query: (data) => ({
        url: `currencies/${data?.code}`,
        method: "PUT",
        body: data,
      }),
    }),
    removeCurrencyById: builder.mutation<void, string>({
      query: (code) => ({
        url: `currencies/${code}`,
        method: "DELETE",
      }),
    }),
    saveFavoriteCurrencies: builder.mutation<
      User,
      { userId: string; currencies: string[] }
    >({
      query: ({ userId, currencies }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: { currencies },
      }),
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useAddCurrencyMutation,
  useEditCurrencyByIdMutation,
  useRemoveCurrencyByIdMutation,
  useSaveFavoriteCurrenciesMutation,
} = currenciesApi;
