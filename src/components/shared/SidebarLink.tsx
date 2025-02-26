"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = (props) => {
  const { href, text } = props;
  const pathName = usePathname();
  return (
    <Link
      href={`${href}`}
      className={`flex justify-center ${pathName === href ? "active" : ""}`}
    >
      {text}
    </Link>
  );
};

export default SidebarLink;
