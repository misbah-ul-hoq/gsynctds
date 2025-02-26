"use client";
import Loader from "@/components/shared/Loader";
import { useGetUserInfoQuery } from "@/redux/features/auth/authApiSlice";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<
    string | null | undefined
  >(undefined);
  const { data, isLoading } = useGetUserInfoQuery(isAuthenticated, {
    skip: !isAuthenticated,
  });
  // useGoogleSignInQuery();
  console.log(data);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(token);
  }, [isAuthenticated]);
  if (isAuthenticated === undefined) {
    return null;
  }
  if (isAuthenticated === null) {
    redirect("/login");
  }
  if (isLoading) return <Loader />;
  return (
    <div className="flex min-h-screen items-center justify-center font-mono">
      <div className="space-y-2 flex flex-col">
        <h3 className="text-xl font-bold">Welcome, {data?.name}</h3>
        <button className="btn" onClick={() => {}}>
          Connect Google Account
        </button>
      </div>
    </div>
  );
}
