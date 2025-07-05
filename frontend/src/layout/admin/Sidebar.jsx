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
} from "lucide-react";
import Image from "next/image";

const NavLink = ({ item, expanded }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link href={item.href}>
      <li
        className={`
          relative flex items-center p-3 my-1 text-sm font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            isActive
              ? "bg-gradient-to-tr from-sky-200 to-sky-100 text-sky-800"
              : "hover:bg-sky-50 text-gray-600"
          }
        `}
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
            bg-sky-100 text-sky-800 text-xs
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
          >
            {item.label}
          </div>
        )}
      </li>
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
  ];

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const desktopSidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-2 flex justify-between items-center">
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
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <ul className="flex-1 px-3 pt-8">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} expanded={expanded} />
        ))}
      </ul>
    </div>
  );

  const mobileSidebarContent = (
    <div className="h-full flex flex-col">
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
      <ul className="flex-1 px-3 pt-8">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            onClick={() => setMobileOpen(false)}
          >
            <li className="relative flex items-center py-2.5 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-sky-50 text-gray-600">
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:block h-screen bg-white border-r shadow-sm transition-all ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        {desktopSidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 md:hidden"
            >
              {mobileSidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
