import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store";
import type {
  AddPaymentMethod,
  PaymentMethod,
} from "../types/paymentMethodsTypes";

export const paymentMethodsApi = createApi({
  reducerPath: "payment-methods",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    },
  }),
  tagTypes: ["PaymentMethods"],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => "payment-methods",
      providesTags: ["PaymentMethods"],
    }),
    getPaymentMethodById: builder.query<PaymentMethod, string>({
      query: (id) => `/payment-methods/${id}`,
      providesTags: ["PaymentMethods"],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, AddPaymentMethod>({
      query: (paymentMethod) => ({
        url: "/payment-methods",
        method: "POST",
        body: paymentMethod,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    editPaymentMethod: builder.mutation<PaymentMethod, PaymentMethod>({
      query: ({ id, ...patch }) => ({
        url: `/payment-methods/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    deletePaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
  }),
});

export const {
  useLazyGetPaymentMethodsQuery,
  useGetPaymentMethodsQuery,
  useGetPaymentMethodByIdQuery,
  useAddPaymentMethodMutation,
  useEditPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodsApi;
