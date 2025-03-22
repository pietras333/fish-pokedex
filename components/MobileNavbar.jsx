"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const mobileNavVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }, // Ensure exit transition
};

const menuItems = [
  { href: "/login", label: "Zaloguj się" },
  { href: "/register", label: "Zarejestruj się" },
  { href: "/privacy-policy", label: "Polityka prywatności" },
];
const MobileNavbar = ({ isOpen, onClose }) => {
  return (
    <motion.nav
      key="mobile-navbar"
      variants={mobileNavVariants}
      initial="hidden"
      animate="visible"
      exit="exit" // Make sure exit is properly defined
      className="fixed top-0 left-0 w-full h-[100dvh] bg-white flex flex-col items-center justify-center text-lg z-40 p-6 overflow-y-auto gap-12 shadow-lg"
    >
      {/* Menu Items */}
      <motion.ul className="mt-6 flex flex-col items-center space-y-6">
        {menuItems.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
            >
              {item.label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.nav>
  );
};

export default MobileNavbar;
