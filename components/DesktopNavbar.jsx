import { motion } from "framer-motion";
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

const DesktopNavbar = () => (
  <motion.ul
    className="w-3/4 h-full flex justify-around items-center font-medium"
    variants={navVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.li variants={menuVariants}>
      <Logo isMobile={false} />
    </motion.li>

    <motion.li variants={menuVariants}>
      <Link
        href="/privacy-policy"
        className="text-lg opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        Polityka prywatności
      </Link>
    </motion.li>
    <motion.li variants={menuVariants}>
      <Link
        href="/register"
        className="text-lg opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        Zarejestruj się
      </Link>
    </motion.li>
    <motion.li variants={menuVariants}>
      <Link href="/login">
        <button className="px-8 py-4 rounded-xl bg-blue-500 text-white text-lg font-medium hover:cursor-pointer hover:bg-blue-700 transition duration-300">
          Zaloguj się
        </button>
      </Link>
    </motion.li>
  </motion.ul>
);

export default DesktopNavbar;
