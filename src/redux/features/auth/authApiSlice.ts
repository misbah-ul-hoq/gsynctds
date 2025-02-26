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
    addLoginData: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    addEmailVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: data,
      }),
    }),
    addAuthVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-authenticator-otp",
        method: "POST",
        body: data,
      }),
    }),
    requestNewEmailVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/auth/request-new-email-otp",
        method: "POST",
        body: data,
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    googleSignIn: builder.query<void, void>({
      query: () => ({
        url: "/auth/google",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddSignUpDataMutation,
  useAddLoginDataMutation,
  useAddEmailVerificationCodeMutation,
  useAddAuthVerificationCodeMutation,
  useRequestNewEmailVerificationCodeMutation,
  useGetUserInfoQuery,
  useGoogleSignInQuery,
} = authApiSlice;
