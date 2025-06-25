import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type TransactionCategory } from "../categoryTypes";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => ({
    getTransactionCategories: builder.query<TransactionCategory, void>({
      query: () => ({
        url: "transactionCategories",
      }),
    }),
  }),
});

export const { useGetTransactionCategoriesQuery } = categoriesApi;
