"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import AppFooter from "@/layout/AppFooter";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hasMounted]);

  const showHeaderFooter = pathname !== "/formulir" && pathname !== "/booking";

  return (
    <div className="min-h-screen bg-gray-50 mb-18 md:mb-0">
      {showHeaderFooter && <AppHeader />}
      <main key={pathname}>{children}</main>
      {showHeaderFooter && <AppFooter />}
    </div>
  );
}
