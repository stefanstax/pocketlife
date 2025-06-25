import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaginatatedTransactions,
  Transaction,
  TransactionExtra,
} from "../transactionTypes";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getTransactions: builder.query<
      PaginatatedTransactions,
      {
        userId: string;
        page?: number;
        limit?: number;
        sortBy: string;
        order: string;
      }
    >({
      query: ({ userId, page, limit, sortBy, order }) => ({
        url: "transactions",
        params: { userId, page, limit, sortBy, order },
      }),
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
