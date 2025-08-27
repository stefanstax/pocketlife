import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../../app/authSlice";
import type { RootState } from "../../../app/store";
import type { UserProfileUpdate } from "../schemas/userSchemas";

export const usersApi = createApi({
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User, string>({
      query: () => "users",
    }),
    getUserById: builder.query<User, string>({
      query: (username) => `users/${username}`,
    }),
    updateUserById: builder.mutation<User, UserProfileUpdate>({
      query: (user) => ({
        url: `users/${user?.id}`,
        method: "PUT",
        body: user
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} = usersApi;
