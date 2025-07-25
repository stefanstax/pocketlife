import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EnrichedTransaction,
  PaginatatedTransactions,
  Transaction,
  TransactionClone,
} from "../types/transactionTypes";
import type { RootState } from "../../../app/store";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
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
    addTransaction: builder.mutation<EnrichedTransaction, TransactionClone>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transactions"],
    }),
    updateTransaction: builder.mutation<
      Transaction,
      Partial<Transaction> & Pick<Transaction, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `transactions/${id}`,
        method: "PUT",
        body: patch,
      }),
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
