"use client";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold drop-shadow-lg max-lg:text-3xl"
      >
        Fish Pokedex
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-4 text-lg max-lg:text-base max-lg:w-3/4 max-lg:text-center"
      >
        Capture and catalog your favorite fishes effortlessly!
      </motion.p>
      <section className="flex w-1/4 justify-around max-lg:w-full max-lg:p-4">
        <a href="/login">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 px-6 py-3 hover:cursor-pointer bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Sign In
          </motion.button>
        </a>
        <a href="/register">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 px-6 py-3 hover:cursor-pointer bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Sign Up
          </motion.button>
        </a>
      </section>
    </div>
  );
};

export default Home;
