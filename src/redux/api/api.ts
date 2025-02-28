import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  tagTypes: ["Events"],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) headers.set("authToken", authToken);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
