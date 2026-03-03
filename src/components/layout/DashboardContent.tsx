"use client";

import { useSidebar } from "@/contexts/SidebarContext";

export default function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? "md:ml-20" : "md:ml-64"
      }`}
    >
      {children}
    </main>
  );
}
