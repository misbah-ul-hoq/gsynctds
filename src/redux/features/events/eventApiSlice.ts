import { baseAPI } from "@/redux/api/api";

const eventApiSlice = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addEvent: builder.mutation({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation({
      query: (data) => ({
        url: `/events/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    getEvents: builder.query<void, void>({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
    }),
    getEventById: builder.query({
      query: (id) => ({
        url: `/events/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
} = eventApiSlice;
