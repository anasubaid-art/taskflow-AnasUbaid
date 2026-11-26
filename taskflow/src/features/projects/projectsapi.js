import { api } from "../../app/api";

export const projectsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => "projects",
            providesTags: ["Projects"],
        }),

        createProject: builder.mutation({
            query: (newProject) => ({
                url: "projects",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Projects"],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `projects/${id}`,
                method: "PATCH",
                body: date,
            }),
            invalidatesTags: ["Projects"],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects"],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectsApi;