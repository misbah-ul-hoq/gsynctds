"use client";
import Sidebar from "@/components/layout/Sidebar";
import store from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <div className={`flex gap-5 lg:grid-cols-12`}>
          <div className={`lg:col-span-3 lg:w-[250px]`}>
            <Sidebar />
          </div>
          <div className={`flex-grow lg:col-span-9`}> {children}</div>
        </div>
      </Provider>
    </SessionProvider>
  );
};

export default StoreProvider;
