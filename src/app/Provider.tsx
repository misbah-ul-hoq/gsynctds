"use client";
import Sidebar from "@/components/layout/Sidebar";
import store from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
const StoreProvider = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const isAuthPage =
    pathName.includes("/login") || pathName.includes("/signup");

  return (
    <SessionProvider>
      <Provider store={store}>
        <div className={`flex gap-5 lg:grid-cols-12`}>
          <div
            className={`lg:col-span-3 lg:w-[250px] ${isAuthPage && "hidden"}`}
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
