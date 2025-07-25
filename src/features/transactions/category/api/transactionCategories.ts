import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store";
import {
  type AddCategoryType,
  type CategoryType,
  type EditCategoryType,
} from "../types/categoryType";

export const transactionCategoriesApi = createApi({
  reducerPath: "transaction-categories",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const token = state.auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
    },
  }),
  tagTypes: ["TransactionCategory"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryType[], void>({
      query: () => ({
        url: "transaction-categories",
      }),
      providesTags: ["TransactionCategory"],
    }),
    getCategoryById: builder.query<CategoryType, string>({
      query: (id) => ({
        url: `transaction-categories/${id}`,
      }),
    }),
    addCategory: builder.mutation<CategoryType, AddCategoryType>({
      query: (data) => ({
        url: "transaction-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TransactionCategory"],
    }),
    editCategory: builder.mutation<CategoryType, EditCategoryType>({
      query: (data) => ({
        url: `transaction-categories/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TransactionCategory"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `transaction-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransactionCategory"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = transactionCategoriesApi;
