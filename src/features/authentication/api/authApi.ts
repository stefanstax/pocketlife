import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../../app/authSlice";
import type { RegistrationState } from "../registration/registrationTypes";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUPABASE_URL,
  }),
  endpoints: (builder) => ({
    addUser: builder.mutation<RegistrationState, RegistrationState>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation<User, { email: string; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useAddUserMutation, useLoginUserMutation } = authApi;
