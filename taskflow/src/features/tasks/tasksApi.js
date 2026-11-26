import { api } from "../..app/api";

export const tasksApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTasksByProject: builder.query({
            query: (projectId) => `tasks?projectId=${projectId}`,
            providesTags: ["Tasks"],
        }),
        createTask: builder.mutation({
            query: (newTask) => ({
                url: "tasks",
                method: "POST",
                body: newTask,
            }),
            invalidatesTags: ["Tasks"],
        }),
        updateTask: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `tasks/${id}`,
                method: "PATCH",
                body: updatedData,
            }),
            invalidatesTags: ["Tasks"],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"]
        }),
    }),
});

export const {
    useGetTasksByProjectQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation
} = tasksApi;