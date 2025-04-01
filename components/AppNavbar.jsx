"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MobileNavbar from "@/components/AppNavbarMobile";
import DesktopNavbar from "@/components/AppNavbarDesktop";
import MobileMenuButton from "@/components/MobileMenuButton";
import Logo from "@/components/Logo";

const AppNavbar = ({ togglePopup }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className={`w-full h-[128px] overflow-hidden ${
        isMobile ? "fixed top-0 left-0 right-0 bg-white shadow-md z-50" : ""
      }`}
    >
      <nav className="w-full h-full flex items-center justify-center">
        {isMobile ? (
          <section className="w-3/4 flex items-center justify-between">
            <Logo isMobile={true} />
            <MobileMenuButton
              isOpen={menuOpen}
              toggleMenu={() => setMenuOpen(!menuOpen)}
            />
          </section>
        ) : (
          <DesktopNavbar togglePopup={togglePopup} />
        )}
        <AnimatePresence mode="wait">
          {isMobile && menuOpen && (
            <div key="mobile-navbar">
              <MobileNavbar
                togglePopup={togglePopup}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </nav>
    </section>
  );
};

export default AppNavbar;
