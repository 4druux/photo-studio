import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';

export default function MainLayout() {
  const location = useLocation();
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
  }, [location.pathname, hasMounted]);

  const showHeaderFooter = location.pathname !== "/formulir" && location.pathname !== "/booking";

  return (
    <div className="min-h-screen bg-gray-50 mb-18 md:mb-0">
      {showHeaderFooter && <AppHeader />}
      <main key={location.pathname}>
        <Outlet />
      </main>
      {showHeaderFooter && <AppFooter />}
    </div>
  );
}