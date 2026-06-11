import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── Public ──────────────────────────────────────────────────
    getPublicReviews: builder.query({
      query: ({ serviceSlug, general } = {}) => {
        const params = new URLSearchParams();
        if (serviceSlug) params.append("serviceSlug", serviceSlug);
        if (general) params.append("general", "true");
        return `/api/reviews?${params.toString()}`;
      },
      providesTags: ["Reviews"],
    }),

    // ── Admin ────────────────────────────────────────────────────
    getAdminReviews: builder.query({
      query: ({ serviceSlug, status, search } = {}) => {
        const params = new URLSearchParams();
        if (serviceSlug) params.append("serviceSlug", serviceSlug);
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return `/api/admin/reviews?${params.toString()}`;
      },
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation({
      query: (body) => ({ url: "/api/admin/reviews", method: "POST", body }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/admin/reviews/${id}`, method: "PUT", body }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/api/admin/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetPublicReviewsQuery,
  useGetAdminReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
