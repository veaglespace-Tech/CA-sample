import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body) => ({ url: "/api/messages/send", method: "POST", body }),
      invalidatesTags: ["Messages", "Dashboard"],
    }),
    sendEmailReminder: builder.mutation({
      query: (body) => ({ url: "/api/messages/email-reminder", method: "POST", body }),
      invalidatesTags: ["Messages", "Dashboard"],
    }),
    getMyMessages: builder.query({
      query: () => "/api/messages/my-messages",
      providesTags: ["Messages"],
    }),
    getUnreadCount: builder.query({
      query: () => "/api/messages/unread-count",
      providesTags: ["Messages"],
    }),
    markMessageAsRead: builder.mutation({
      query: (id) => ({ url: `/api/messages/${id}/read`, method: "PUT" }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({ url: `/api/messages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Messages", "Dashboard"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useSendEmailReminderMutation,
  useGetMyMessagesQuery,
  useGetUnreadCountQuery,
  useMarkMessageAsReadMutation,
  useDeleteMessageMutation,
} = messageApi;
