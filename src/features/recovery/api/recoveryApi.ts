import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store";

export const recoveryApi = createApi({
  reducerPath: "recoveryApi",
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
    verifySecurityName: builder.mutation<
      { message: string },
      { slug: string; securityName: string }
    >({
      query: ({ slug, securityName }) => ({
        url: `recovery/${slug}`,
        method: "POST",
        body: { securityName },
      }),
    }),
    resetPasscode: builder.mutation<
      { message: string },
      { slug: string; newPasscode: string }
    >({
      query: ({ slug, newPasscode }) => ({
        url: `recovery/${slug}/reset`,
        method: "POST",
        body: { newPasscode },
      }),
    }),
  }),
});

export const { useVerifySecurityNameMutation, useResetPasscodeMutation } =
  recoveryApi;
