"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from handling redirect
      username: form.username,
      password: form.password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/fishPokedex"); // Redirect after successful login
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400 text-white">
      {session ? (
        <p className="text-xl">
          Welcome, {session.user.username}! Redirecting...
        </p>
      ) : (
        <>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold"
          >
            Login
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4 w-1/3 max-lg:w-3/4"
          >
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-3 rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-3 rounded-lg"
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button className="mt-4 bg-white text-blue-600 py-3 px-6 rounded-lg">
              {loading ? "Logging in..." : "Login"}
            </button>
          </motion.form>
        </>
      )}
    </div>
  );
};

export default Login;
