"use client";
import { motion } from "framer-motion";
import { useState } from "react";

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
      setMessage("Passwords do not match!");
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
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold drop-shadow-lg max-lg:text-3xl"
      >
        Register
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 w-1/3 max-lg:w-3/4"
      >
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="p-3 rounded-lg text-gray-900 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-3 rounded-lg text-gray-900 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="p-3 rounded-lg text-gray-900 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />

        {message && <p className="text-center text-sm mt-2">{message}</p>}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition w-full"
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Register;
