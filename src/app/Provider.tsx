"use client";
import Sidebar from "@/components/layout/Sidebar";
import store from "@/redux/store";
import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<undefined | null | string>();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setAuthToken(token);
  }, []);
  return (
    <SessionProvider>
      <Provider store={store}>
        <div className={`flex gap-5 lg:grid-cols-12`}>
          <div
            className={`lg:col-span-3 lg:w-[250px] ${!authToken && "hidden"}`}
          >
            <Sidebar />
          </div>
          <div className={`flex-grow lg:col-span-9`}> {children}</div>
        </div>
      </Provider>
    </SessionProvider>
  );
};

export default StoreProvider;
