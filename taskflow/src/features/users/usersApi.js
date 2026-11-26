import { api } from "../../app/api";

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "users",
            providesTags: ["Users"],
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;