"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/layout/admin/Sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        expanded={desktopExpanded}
        setExpanded={setDesktopExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b z-10">
          <Image
            src="/images/logo.png"
            alt="logo antika studio"
            width={100}
            height={20}
          />
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <main className="flex-1 xl:p-8">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </main>
      </div>
    </div>
  );
}
