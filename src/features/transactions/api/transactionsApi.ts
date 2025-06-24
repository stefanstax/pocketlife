import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, TransactionExtra } from "../transactionTypes";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),
    getTransactionById: builder.query<TransactionExtra, string>({
      query: (id) => `transactions/${id}`,
    }),
    addTransaction: builder.mutation<Transaction, TransactionExtra>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),
    updateTransaction: builder.mutation<Transaction, Transaction>({
      query: (transaction) => ({
        url: `transactions/${transaction?.id}`,
        method: "PUT",
        body: transaction,
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} = transactionsApi;
