"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/layout/admin/Sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }) {
  // State untuk sidebar desktop (ciut/lebar)
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  // State untuk sidebar mobile (tampil/sembunyi)
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        expanded={desktopExpanded}
        setExpanded={setDesktopExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col">
        <header className="md:hidden sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b z-10">
          <Image
            src="/images/logo.png"
            alt="logo antika studio"
            width={100}
            height={20}
          />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </main>
      </div>
    </div>
  );
}
