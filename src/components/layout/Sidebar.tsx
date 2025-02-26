"use client";

import { usePathname } from "next/navigation";
import React from "react";
import SidebarLink from "../shared/SidebarLink";

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <aside
      className={`h-screen overflow-y-auto bg-base-200 pt-7 ${
        pathName.includes("/login") || (pathName.includes("/login") && "hidden")
      }`}
    >
      <ul className="flex flex-col items-stretch gap-1 list-none menu">
        <li className="">
          <SidebarLink href="/" text="Home" />
        </li>
        <li>
          <SidebarLink href="/settings" text="Settings" />
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
