"use client";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi"; // Importing a logout icon

import Loader from "@/components/shared/Loader";
import { useGetUserInfoQuery } from "@/redux/features/auth/authApiSlice";
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<
    string | null | undefined
  >(undefined);
  const { isLoading } = useGetUserInfoQuery(isAuthenticated, {
    skip: !isAuthenticated,
  });

  const { data: session } = useSession();
  const { name, image } = session?.user || {};
  console.log(session);

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
      <div className="flex flex-col space-y-2">
        {!session?.user && (
          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-5 py-2 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md sm:w-auto"
          >
            <Image
              src="/google.svg"
              alt="Google Logo"
              height={20}
              width={20}
              className="h-6 w-6"
            />

            <span className="m-0 font-medium">Connect With Google</span>
          </button>
        )}
        {session?.user && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={`${image}`}
              alt={`${name}`}
              height={70}
              width={70}
              className="rounded-full"
            />
            <div className="my-3 space-y-1 text-center">
              <h3 className="text-xl font-bold">Welcome, {name}</h3>
              <p>
                Navigate to the sidebar links to edit, view and delete notes
              </p>
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-5 py-2 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md sm:w-auto">
              <FiLogOut className="h-5 w-5 text-gray-700" />
              <span
                className="font-medium text-gray-700"
                onClick={() => signOut()}
              >
                Sign Out
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
