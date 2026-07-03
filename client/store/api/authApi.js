import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyAdminOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/verify-admin-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    requestAdminPasswordReset: builder.mutation({
      query: (body) => ({
        url: "/api/auth/admin/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetAdminPassword: builder.mutation({
      query: (body) => ({
        url: "/api/auth/admin/reset-password",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
      invalidatesTags: ["Auth", "Dashboard"],
    }),
    getMe: builder.query({
      query: () => "/api/auth/me",
      providesTags: ["Auth"],
    }),
    getDashboardSummary: builder.query({
      query: () => "/api/modules/summary",
      providesTags: ["Dashboard"],
    }),
    getMyServices: builder.query({
      query: () => "/api/leads/my-services",
      providesTags: ["Dashboard", "Leads"],
    }),
    getMyReferrals: builder.query({
      query: () => "/api/my-referrals",
      providesTags: ["Dashboard"],
    }),
    updateMe: builder.mutation({
      query: (body) => ({
        url: "/api/auth/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyAdminOtpMutation,
  useRequestAdminPasswordResetMutation,
  useResetAdminPasswordMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetDashboardSummaryQuery,
  useGetMyServicesQuery,
  useGetMyReferralsQuery,
  useUpdateMeMutation,
} = authApi;
