"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Hasła nie są identyczne!");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col max-xl:gap-8"
    >
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow p-6 max-w-md mx-auto text-gray-700">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-blue-700 mb-4 text-center"
        >
          Rejestracja
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {["username", "password", "password"].map((field, index) => (
            <motion.input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={
                field === "username"
                  ? "Nazwa użytkownika"
                  : field === "password"
                  ? "Hasło"
                  : "Potwierdź hasło"
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              required
            />
          ))}

          {message && (
            <motion.p
              className="text-center text-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 hover:cursor-pointer bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Zarejestruj się
          </motion.button>
        </motion.form>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Register;
