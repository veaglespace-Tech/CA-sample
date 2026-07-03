import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (body) => ({
        url: "/api/payment/initiate",
        method: "POST",
        body,
      }),
    }),
    getPaymentStatus: builder.query({
      query: (leadId) => `/api/payment/status/${leadId}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useInitiatePaymentMutation, useGetPaymentStatusQuery } = paymentApi;
