import { baseApi } from "./baseApi";
import { buildPlansQueryParams } from "../../lib/plans";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query({
      query: (params = {}) => {
        const query = buildPlansQueryParams(params);
        return `/api/plans/all${query.toString() ? `?${query.toString()}` : ""}`;
      },
      providesTags: ["Plans", "Dashboard"],
    }),
    createPlan: builder.mutation({
      query: (body) => ({ url: "/api/plans", method: "POST", body }),
      invalidatesTags: ["Plans", "Dashboard"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/plans/${id}`, method: "PUT", body }),
      invalidatesTags: ["Plans", "Dashboard"],
    }),
    assignPlanToUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/plans/${id}/assign-user`, method: "POST", body }),
      invalidatesTags: ["Plans", "Dashboard", "Messages"],
    }),
    deletePlan: builder.mutation({
      query: (id) => ({ url: `/api/plans/${id}`, method: "DELETE" }),
      invalidatesTags: ["Plans", "Dashboard"],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useAssignPlanToUserMutation,
  useDeletePlanMutation,
} = planApi;
