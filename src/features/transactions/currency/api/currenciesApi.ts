import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CurrencyState } from "../types/currencyTypes";
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
  tagTypes: ["Currencies"],
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyState[], void>({
      query: () => "currencies",
      providesTags: ["Currencies"],
    }),
    getCurrencyById: builder.query<CurrencyState, string>({
      query: (id) => `currencies/${id}`,
      providesTags: ["Currencies"],
    }),
    addCurrency: builder.mutation<CurrencyState, CurrencyState>({
      query: (data) => ({
        url: "currencies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Currencies"],
    }),
    editCurrencyById: builder.mutation<CurrencyState, CurrencyState>({
      query: (data) => ({
        url: `currencies/${data?.code}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Currencies"],
    }),
    removeCurrencyById: builder.mutation<void, string>({
      query: (code) => ({
        url: `currencies/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Currencies"],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useAddCurrencyMutation,
  useEditCurrencyByIdMutation,
  useRemoveCurrencyByIdMutation,
} = currenciesApi;
