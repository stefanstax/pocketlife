import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserWithToken } from "../../../app/authSlice";
import type { RegistrationState } from "../registration/registrationTypes";
import type { LoginState } from "../login/loginTypes";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    addUser: builder.mutation<RegistrationState, RegistrationState>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation<UserWithToken, LoginState>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useAddUserMutation, useLoginUserMutation } = authApi;
