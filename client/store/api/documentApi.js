import { baseApi } from "./baseApi";

export const documentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadDocument: builder.mutation({
      query: (body) => ({ url: "/api/documents/upload", method: "POST", body }),
      invalidatesTags: ["Documents", "Dashboard"],
    }),
    getMyDocuments: builder.query({
      query: () => "/api/documents/my-documents",
      providesTags: ["Documents"],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({ url: `/api/documents/${id}`, method: "DELETE" }),
      invalidatesTags: ["Documents", "Dashboard"],
    }),
    updateDocument: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/documents/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Documents", "Dashboard"],
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useGetMyDocumentsQuery,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} = documentApi;
