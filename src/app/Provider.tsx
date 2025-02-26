"use client";
import Sidebar from "@/components/layout/Sidebar";
import store from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <div className={`grid lg:grid-cols-12 gap-5`}>
        <div className={`lg:col-span-3`}>
          <Sidebar />
        </div>
        <div className={`lg:col-span-9`}> {children}</div>
      </div>
    </Provider>
  );
};

export default StoreProvider;
