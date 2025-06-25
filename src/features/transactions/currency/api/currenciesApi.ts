import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CurrencyState } from "../currencyTypes";
import type { User } from "../../../app/authSlice";

export const currenciesApi = createApi({
  reducerPath: "currenciesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
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
        url: `currencies/${data?.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    removeCurrencyById: builder.mutation<void, string>({
      query: (id) => ({
        url: `currencies/${id}`,
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
        body: currencies,
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
