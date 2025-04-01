"use client";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { FaFish } from "react-icons/fa";
import Link from "next/link";
import Logo from "@/components/Logo";

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const navVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const DesktopNavbar = ({ togglePopup }) => {
  const { data: session } = useSession(); // Get user session

  return (
    <motion.ul
      className="w-3/4 h-full flex justify-around items-center font-medium"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.li variants={menuVariants}>
        <Logo isMobile={false} />
      </motion.li>

      <motion.li className="flex gap-x-4 items-center" variants={menuVariants}>
        <div className="bg-blue-500 w-[48px] h-[48px] rounded-3xl"></div>
        <Link
          href="/webapp/profile"
          className="text-lg opacity-50 flex items-center hover:opacity-100 transition-opacity duration-300"
        >
          {session?.user?.username || "Profil"}
        </Link>
      </motion.li>

      <motion.li variants={menuVariants}>
        <input
          type="text"
          name="profile-search"
          placeholder="Wyszukaj profil..."
          className="w-full p-2 border rounded-lg"
        />
      </motion.li>

      <motion.li variants={menuVariants}>
        <Link
          href="/webapp"
          className="text-lg opacity-50 hover:opacity-100 transition-opacity duration-300"
        >
          Posty
        </Link>
      </motion.li>

      <motion.li variants={menuVariants}>
        <button
          onClick={() => togglePopup()}
          className="px-6 py-4 rounded-xl bg-blue-500 text-white text-xl font-medium hover:cursor-pointer hover:bg-blue-700 transition duration-300"
        >
          <FaFish className="inline-block mr-2" />+
        </button>
      </motion.li>

      <motion.li variants={menuVariants}>
        <button
          onClick={() => signOut()}
          className="px-8 py-4 rounded-xl bg-red-500 text-white text-lg font-medium hover:cursor-pointer hover:bg-red-700 transition duration-300"
        >
          Wyloguj się
        </button>
      </motion.li>
    </motion.ul>
  );
};

export default DesktopNavbar;
