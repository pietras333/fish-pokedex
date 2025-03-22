"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFish, FaSearch, FaBookOpen } from "react-icons/fa";

const values = [
  {
    icon: <FaFish className="text-4xl text-blue-600" />,
    title: "Poznawaj gatunki",
    description: "Identyfikuj ryby w kilka sekund dzięki naszej bazie danych.",
  },
  {
    icon: <FaSearch className="text-4xl text-blue-600" />,
    title: "Skanuj i odkrywaj",
    description:
      "Wystarczy zdjęcie, aby dowiedzieć się więcej o danym gatunku.",
  },
  {
    icon: <FaBookOpen className="text-4xl text-blue-600" />,
    title: "Twórz własny katalog",
    description: "Zapisuj swoje znaleziska i buduj kolekcję ryb.",
  },
];

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-dvh flex flex-col max-xl:gap-8 overflow-x-hidden"
    >
      <Navbar />
      <section className="h-dvh max-xl:min-h-dvh max-xl:h-fit w-full flex max-xl:flex-col">
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-1/3 max-xl:h-1/3 h-full flex flex-col max-xl:w-full justify-around items-center p-8"
        >
          <section className="flex flex-col gap-4 max-xl:text-center">
            <h1 className="text-5xl max-xl:text-3xl font-bold text-blue-500 mt-32">
              FishDecks – Twój osobisty PokéDex ryb! <br /> Odkrywaj,
              identyfikuj i kolekcjonuj ryby z całej Polski! 🌊🐟📖
            </h1>
            <p className="text-lg max-xl:text-base text-gray-600">
              Zanurz się w świat ryb! 🐠 Dzięki FishDecks możesz szybko
              identyfikować gatunki, zapisywać swoje znaleziska i poszerzać
              wiedzę o podwodnym świecie. Idealne narzędzie dla wędkarzy, nurków
              i pasjonatów akwarystyki! 🌊📚
            </p>
          </section>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-4 max-xl:mt-4 rounded-xl bg-blue-500 text-white text-lg font-medium hover:bg-blue-700 hover:cursor-pointer transition duration-300"
            >
              Zarejestruj się
            </motion.button>
          </Link>
        </motion.section>
        <motion.section
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-2/3 max-xl:h-2/3 h-full rounded-tl-3xl max-xl:w-full max-xl:rounded-3xl rounded-bl-3xl bg-blue-500 flex flex-col justify-center items-center"
        >
          <section className="w-3/4 max-xl:text-center h-fit flex flex-col gap-8 justify-center items-center">
            <h2 className="text-3xl font-bold text-center max-xl:mt-8 text-white">
              Odkrywaj podwodny świat z FishDecks
            </h2>
            <p className="text-lg text-center text-white mt-2">
              Skanuj, identyfikuj i kolekcjonuj ryby z całego świata. FishDecks
              to Twój cyfrowy atlas wodnych stworzeń! 🌊🐟
            </p>
          </section>
          <section className="w-3/4 max-xl:text-center h-fit flex mt-8 flex-wrap justify-center gap-8 pb-16">
            {values.map((value, index) => (
              <motion.section
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center p-8 max-lg:p-4 rounded-xl bg-white shadow-lg border border-gray-200 w-[280px] h-[250px] max-lg:h-fit transition-transform duration-300 hover:scale-105"
                whileHover={{ scale: 1.08 }}
              >
                {value.icon}
                <h2 className="text-lg font-medium mt-4 text-blue-700">
                  {value.title}
                </h2>
                <p className="text-sm mt-2 text-gray-600">
                  {value.description}
                </p>
              </motion.section>
            ))}
          </section>
        </motion.section>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Home;
