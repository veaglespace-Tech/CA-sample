import { baseApi } from "./baseApi";

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/api/events",
      providesTags: ["Events"],
    }),
    createEvent: builder.mutation({
      query: (body) => ({ url: "/api/admin/events", method: "POST", body }),
      invalidatesTags: ["Dashboard", "Events"],
    }),
    registerForEvent: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/events/${id}/register`, method: "POST", body }),
      invalidatesTags: ["Dashboard", "Events"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, body, ...rest }) => ({ 
        url: `/api/admin/events/${id}`, 
        method: "PUT", 
        body: body || rest 
      }),
      invalidatesTags: ["Dashboard", "Events"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({ url: `/api/admin/events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Dashboard", "Events"],
    }),
    sendEventInvite: builder.mutation({
      query: ({ eventId, registrationId, body }) => ({ url: `/api/admin/events/${eventId}/invite/${registrationId}`, method: "POST", body }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useRegisterForEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useSendEventInviteMutation,
} = eventApi;
