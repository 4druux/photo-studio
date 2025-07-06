"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  ImageUp,
  X,
  ChevronFirst,
  ChevronLast,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";

const NavLink = ({ item, expanded, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center text-sm font-medium rounded-md cursor-pointer
        transition-colors group w-full
        ${
          isActive
            ? "bg-gradient-to-tr from-teal-200 to-teal-100 text-teal-700"
            : "text-gray-600 hover:bg-teal-50"
        }
        ${expanded ? "p-3" : "p-3"}`}
    >
      {item.icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {item.label}
      </span>
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-teal-50 text-teal-600 text-xs
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {item.label}
        </div>
      )}
    </Link>
  );
};

export default function Sidebar({
  expanded,
  setExpanded,
  mobileOpen,
  setMobileOpen,
}) {
  const navItems = [
    {
      label: "Request Booking",
      icon: <CalendarClock size={20} />,
      href: "/admin/booking",
    },
    {
      label: "Upload Gambar",
      icon: <ImageUp size={20} />,
      href: "/admin/upload-gambar",
    },
    {
      label: "Kelola Galeri",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/kelola-galeri",
    },
  ];

  const overlayVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const menuPanelVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { x: "-100%", transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const mobileNavContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const desktopSidebarContent = (
    <div className={`h-full flex flex-col`}>
      <div className="p-4 pb-2 flex justify-between items-center mt-2">
        <Image
          src="/images/logo.png"
          alt="logo antika studio"
          width={100}
          height={20}
          className={`overflow-hidden transition-all ${
            expanded ? "w-32" : "w-0"
          }`}
        />
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <ul className="flex-1 px-3 pt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} expanded={expanded} />
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block bg-white border-r shadow-sm transition-all ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        {desktopSidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              key="menu-panel"
              variants={menuPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden rounded-r-2xl shadow-xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <Image
                  src="/images/logo.png"
                  alt="logo antika studio"
                  width={120}
                  height={24}
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <motion.ul
                className="flex-1 px-3 pt-4 space-y-2"
                variants={mobileNavContainerVariants}
              >
                {navItems.map((item) => (
                  <motion.li key={item.href} variants={mobileNavItemVariants}>
                    <NavLink
                      item={item}
                      expanded={true}
                      onClick={() => setMobileOpen(false)}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
