import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllData: builder.query({
      query: () => "/api/admin/all-data",
      providesTags: ["Dashboard"],
    }),
    getPermissionCatalog: builder.query({
      query: () => "/api/admin/permissions/catalog",
      providesTags: ["Dashboard"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "/api/admin/users", method: "POST", body }),
      invalidatesTags: ["Dashboard", "Auth"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/admin/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["Dashboard", "Auth"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/api/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    searchUsers: builder.query({
      query: (q) => `/api/admin/users/search?q=${q}`,
      providesTags: ["Dashboard"],
    }),
    searchLeads: builder.query({
      query: (q) => `/api/admin/leads/search?q=${q}`,
      providesTags: ["Dashboard"],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/api/leads/${id}/status`, method: "PUT", body: { status } }),
      invalidatesTags: ["Dashboard", "Leads"],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({ url: `/api/admin/leads/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    deleteRegistration: builder.mutation({
      query: (id) => ({ url: `/api/admin/registrations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    addLeadNote: builder.mutation({
      query: ({ id, note }) => ({ url: `/api/leads/${id}/notes`, method: "POST", body: { note } }),
      invalidatesTags: ["Dashboard", "Leads"],
    }),
    getRepository: builder.query({
      query: () => "/api/admin/repository",
      providesTags: ["Dashboard"],
    }),
    uploadToRepository: builder.mutation({
      query: (body) => ({ url: "/api/admin/repository/upload", method: "POST", body }),
      invalidatesTags: ["Dashboard"],
    }),
    deleteFromRepository: builder.mutation({
      query: (id) => ({ url: `/api/admin/repository/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    updateRepositoryDocument: builder.mutation({
      query: ({ id, body }) => ({ url: `/api/admin/repository/${id}`, method: "PUT", body }),
      invalidatesTags: ["Dashboard"],
    }),
    getArticles: builder.query({
      query: () => "/api/admin/articles",
      providesTags: ["Dashboard"],
    }),
    createArticle: builder.mutation({
      query: (body) => ({ url: "/api/admin/articles", method: "POST", body }),
      invalidatesTags: ["Dashboard"],
    }),
    updateArticle: builder.mutation({
      query: ({ id, body, ...rest }) => ({ 
        url: `/api/admin/articles/${id}`, 
        method: "PUT", 
        body: body || rest 
      }),
      invalidatesTags: ["Dashboard"],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({ url: `/api/admin/articles/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    verifyDocument: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/api/admin/documents/${id}/verify`,
        method: "PUT",
        body: { status, reason },
      }),
      invalidatesTags: ["Dashboard", "Documents"],
    }),
    getNewsletterSubscribers: builder.query({
      query: () => "/api/newsletter/subscribers",
      providesTags: ["Dashboard"],
    }),
    updateReferralStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/referrals/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Dashboard"],
    }),
    updateReferralReward: builder.mutation({
      query: (body) => ({
        url: "/api/admin/referral-rewards",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    getAdminPermissions: builder.query({
      query: () => "/api/admin/permissions",
      providesTags: ["Permissions"],
    }),
    updateAdminPermissions: builder.mutation({
      query: ({ adminId, permissions }) => ({
        url: `/api/admin/permissions/${adminId}`,
        method: "PUT",
        body: { permissions },
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
});

export const {
  useGetAllDataQuery,
  useGetPermissionCatalogQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSearchUsersQuery,
  useSearchLeadsQuery,
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation,
  useDeleteRegistrationMutation,
  useAddLeadNoteMutation,
  useGetRepositoryQuery,
  useUploadToRepositoryMutation,
  useDeleteFromRepositoryMutation,
  useUpdateRepositoryDocumentMutation,
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useVerifyDocumentMutation,
  useGetNewsletterSubscribersQuery,
  useUpdateReferralStatusMutation,
  useUpdateReferralRewardMutation,
  useGetAdminPermissionsQuery,
  useUpdateAdminPermissionsMutation,
} = adminApi;
