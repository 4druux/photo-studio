import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AppHeader() {
  const [isTop, setIsTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsTop(window.scrollY <= 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass = (path) =>
    `relative text-md font-semibold transition-colors duration-300 group ${
      location.pathname === path ? "text-teal-600" : "text-gray-500 hover:text-teal-600"
    }`;

  const navLinkSpanClass = (path) =>
    `absolute bottom-[-6px] left-1/2 -translate-x-1/2 h-0.5 bg-teal-600 transition-all duration-300 ease-out ${
      location.pathname === path ? "w-1/2" : "w-0 group-hover:w-full"
    }`;

  const mobileNavLinkClass = (path) =>
    `block py-3 px-4 text-lg font-medium rounded-xl transition-colors ${
      location.pathname === path ? "bg-teal-100 text-teal-600" : "text-gray-500 hover:bg-gray-100"
    }`;

  const overlayVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
  const menuPanelVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.1 },
    },
    exit: { x: "100%", transition: { duration: 0.2, ease: "easeInOut" } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isTop ? "bg-gray-50" : "bg-white shadow-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Antika Studio logo"
              className="cursor-pointer w-[100px] md:w-[150px] h-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                <Link
                  to={link.href}
                  className={navLinkClass(link.href)}
                >
                  {link.label}
                </Link>
                <span className={navLinkSpanClass(link.href)} />
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              key="menu-panel"
              variants={menuPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-3/5 max-w-xs bg-gray-50 shadow-xl rounded-l-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="font-semibold text-lg text-gray-600">Menu</h2>
                <button onClick={closeMenu} aria-label="Tutup menu">
                  <X className="w-7 h-7 text-gray-600" />
                </button>
              </div>
              <motion.nav
                className="flex flex-col p-6 space-y-2"
                variants={menuPanelVariants}
              >
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      to={link.href}
                      onClick={closeMenu}
                      className={mobileNavLinkClass(link.href)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="pt-4 border-t">
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="block py-3 px-4 text-lg font-medium rounded-xl text-gray-500 hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AppHeader;