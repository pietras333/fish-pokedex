"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/webapp");
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/webapp");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col max-xl:gap-8">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow p-6 max-w-md mx-auto text-gray-700">
        {status === "authenticated" ? (
          <p className="text-xl font-semibold text-center text-blue-700">
            Witaj, {session.user.username}! Trwa przekierowanie...
          </p>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl font-bold text-blue-700 mb-4 text-center"
            >
              Logowanie
            </motion.h1>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nazwa użytkownika"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Hasło"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </motion.form>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Login;
