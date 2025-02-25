import { baseAPI } from "@/redux/api/api";

const authApiSlice = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addSignUpData: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useAddSignUpDataMutation } = authApiSlice;
