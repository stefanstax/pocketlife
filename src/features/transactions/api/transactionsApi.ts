import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaginatatedTransactions,
  Transaction,
  TransactionClone,
} from "../transactionTypes";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Transactions"],
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
      providesTags: ["Transactions"],
    }),
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => `transactions/${id}`,
    }),
    addTransaction: builder.mutation<Transaction, TransactionClone>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
    updateTransaction: builder.mutation<Transaction, Transaction>({
      query: (transaction) => ({
        url: `transactions/${transaction?.id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
