"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const mobileNavVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }, // Ensure exit transition
};

const menuItems = [
  { href: "/webapp/profile", label: "Mój profil" },
  { href: "/webapp", label: "Posty" },
];
const MobileNavbar = ({ isOpen, onClose, togglePopup }) => {
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
        <motion.li
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, delay: (menuItems.length + 1) * 0.1 }}
        >
          <button
            onClick={() => {
              togglePopup();
            }}
            className="px-6 py-4 rounded-xl bg-blue-500 text-white text-lg font-medium hover:cursor-pointer hover:bg-blue-700 transition duration-300"
          >
            Dodaj rybę
          </button>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, delay: (menuItems.length + 2) * 0.1 }}
        >
          <button
            onClick={() => {
              signOut();
            }}
            className="px-6 py-4 rounded-xl bg-red-500 text-white text-lg font-medium hover:cursor-pointer hover:bg-red-700 transition duration-300"
          >
            Wyloguj się
          </button>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
};

export default MobileNavbar;
