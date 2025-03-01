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
    // sync post events with google calendar.
    syncPost: builder.mutation({
      query: (data) => ({
        url: "/events/sync",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    // sync delete events with google calendar.
    syncDelete: builder.mutation({
      query: (body) => ({
        url: "/events/sync-all",
        method: "DELETE",
        body,
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
      providesTags: ["Events"],
    }),
    getEventById: builder.query({
      query: (id) => ({
        url: `/events/${id}`,
        method: "GET",
      }),
    }),
    getEventsCount: builder.mutation({
      query: (body) => ({
        url: "/events/count/all",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAddEventMutation,
  useSyncPostMutation,
  useSyncDeleteMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetEventsCountMutation,
} = eventApiSlice;
