import { baseApi } from "./baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnreadContacts: builder.query({
      query: () => "/api/contacts/unread",
      providesTags: ["Dashboard"],
    }),
    getAllContacts: builder.query({
      query: () => "/api/contacts/all",
      providesTags: ["Dashboard"],
    }),
    markContactAsRead: builder.mutation({
      query: (id) => ({ url: `/api/contacts/${id}/read`, method: "PUT" }),
      invalidatesTags: ["Dashboard"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({ url: `/api/contacts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard"],
    }),
    replyToContact: builder.mutation({
      query: ({ id, body }) => ({ url: `/api/contacts/${id}/reply`, method: "POST", body }),
      invalidatesTags: ["Dashboard"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/api/contacts/${id}/status`, method: "PUT", body: { status } }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUnreadContactsQuery,
  useGetAllContactsQuery,
  useMarkContactAsReadMutation,
  useDeleteContactMutation,
  useReplyToContactMutation,
  useUpdateContactStatusMutation,
} = contactApi;
