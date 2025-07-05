"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppHeader from "@/layout/user/AppHeader";
import AppFooter from "@/layout/user/AppFooter";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const hash = window.location.hash;

      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
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
