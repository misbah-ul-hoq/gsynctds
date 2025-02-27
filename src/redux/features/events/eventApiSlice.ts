import { baseAPI } from "@/redux/api/api";

const eventApiSlice = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addEvent: builder.mutation({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
    }),
    getCalenderEvents: builder.query({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
    }),
  }),
});

export const {} = eventApiSlice;
