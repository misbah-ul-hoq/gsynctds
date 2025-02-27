"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
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
  );
}
