"use client";

import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.3 * i },
  }),
};

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AnimatedHeading = ({ text }) => {
  return (
    <motion.h1
      className="text-5xl max-lg:text-center max-lg:text-4xl h-fit font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FB00F0] to-[#1180FF] animate-gradient leading-tight"
      variants={textVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {text.split("").map((letter, index) => (
        <motion.span key={index} variants={letterVariants}>
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default AnimatedHeading;
