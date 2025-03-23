"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import speciesData from "@/data/species.json";
import { AnimatePresence, motion } from "framer-motion";

const WebApp = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fish, setFish] = useState([]);
  const [latestCatches, setLatestCatches] = useState([]);
  const [newFish, setNewFish] = useState({
    species: "",
    weight: "",
    length: "",
    date: "",
  });
  const [message, setMessage] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);
  const [catches, setCatches] = useState([]);
  const [loadingCatches, setLoadingCatches] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    fetch("/api/fish")
      .then((res) => res.json())
      .then((data) => setFish(data));

    fetch("/api/fish?latest=true")
      .then((res) => res.json())
      .then((data) => setLatestCatches(data));
  }, [session, status, router]);

  const handleSelectFish = async (species) => {
    setSelectedFish(species);
    setLoadingCatches(true);
    setShowPopup(true);

    try {
      const res = await fetch(`/api/fish?species=${species}`);
      const data = await res.json();
      setCatches(data.sort((a, b) => b.length - a.length)); // Sortowanie malejąco po długości
    } catch (error) {
      console.error("Error fetching catches:", error);
      setCatches([]);
    }

    setLoadingCatches(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFish(null);
  };

  const handleChange = (e) => {
    setNewFish({ ...newFish, [e.target.name]: e.target.value });
  };

  const handleAddFish = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newFish.species) {
      setMessage("Wybierz gatunek ryby!");
      return;
    }

    try {
      const res = await fetch("/api/fish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: newFish.species,
          weight: parseFloat(newFish.weight) || 0,
          length: parseFloat(newFish.length) || 0,
          date: newFish.date,
          user: session?.user?.username, // Dodanie użytkownika do rekordu połowu
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Nie udało się dodać ryby.");
        return;
      }

      setFish([
        ...fish,
        {
          ...newFish,
          date: new Date().toISOString(),
          user: session?.user?.username,
        },
      ]);
      setMessage("Ryba dodana pomyślnie!");
      setNewFish({ species: "", weight: "", length: "" });
    } catch (error) {
      console.error("Błąd:", error);
      setMessage("Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  // Zestaw złowionych gatunków TYLKO przez aktualnego użytkownika
  const caughtSpeciesByUser = new Set(
    fish.filter((f) => f.user === session?.user?.username).map((f) => f.species)
  );

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow p-6 max-w-4xl mx-auto text-gray-700">
        <div className="flex justify-between w-full mb-6 max-xl:mt-32">
          <h1 className="text-3xl font-bold text-blue-700">🎣 Fish Pokedex</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:cursor-pointer hover:bg-red-700 transition-colors duration-300 px-4 py-2 rounded-lg text-white"
          >
            Wyloguj się
          </button>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl"
        >
          Witaj, {session?.user?.username}!
        </motion.p>

        <section className="grid grid-cols-1 md:grid-cols-3 max-xl:flex max-xl:flex-col gap-6 w-full mt-6">
          {/* Formularz dodawania ryby */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            duration={0.5}
            delay={0.5}
            className="bg-white p-6 rounded-lg shadow-md col-span-2"
          >
            <h2 className="text-2xl font-bold mb-4">🐟 Dodaj nową rybę</h2>
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <form onSubmit={handleAddFish} className="space-y-3">
              <select
                name="species"
                onChange={handleChange}
                value={newFish.species}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Wybierz gatunek</option>
                {Object.keys(speciesData).map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="weight"
                placeholder="Waga (kg)"
                value={newFish.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="number"
                name="length"
                placeholder="Długość (cm)"
                value={newFish.length}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="date"
                name="date"
                value={newFish.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-colors duration-300 text-white px-4 py-2 rounded-lg w-full"
              >
                Dodaj rybę
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold">📰 Ostatnie połowy</h2>
            <ul className="mt-2 max-h-52 overflow-y-auto">
              {latestCatches.map((catchData, index) => (
                <li key={index} className="border-b py-2">
                  <strong>{catchData.user}</strong> złowił {catchData.species} (
                  {catchData.length}cm, {catchData.weight}
                  kg){" "}
                  <span className="text-sm">
                    {new Date(catchData.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        <h2 className="text-2xl font-bold mt-8">📖 Fishdeck</h2>
        <div className="flex gap-4 flex-wrap max-xl:justify-center mt-4">
          {Object.keys(speciesData).map((species, index) => (
            <motion.div
              key={species}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl w-32 h-32 bg-gray-300 flex justify-center items-center rounded-lg shadow-md"
              onClick={() => handleSelectFish(species)}
            >
              <Image
                src={
                  caughtSpeciesByUser.has(species)
                    ? speciesData[species].image
                    : speciesData[species].grayImage
                }
                className={
                  caughtSpeciesByUser.has(species)
                    ? "opacity-100"
                    : "opacity-25"
                }
                alt={species}
                width={64}
                height={64}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPUP */}
      <AnimatePresence>
        {showPopup && selectedFish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center"
          >
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {selectedFish}
              </h2>
              <Image
                src={
                  caughtSpeciesByUser.has(selectedFish)
                    ? speciesData[selectedFish].image
                    : speciesData[selectedFish].grayImage
                }
                width={300}
                height={200}
                alt={selectedFish}
                className={`rounded-lg mx-auto mb-4 ${
                  caughtSpeciesByUser.has(selectedFish)
                    ? "opacity-100"
                    : "opacity-25"
                }`}
              />
              <h3 className="text-lg font-semibold mb-2">🏆 Ranking połowów</h3>
              {loadingCatches ? (
                <p>Ładowanie...</p>
              ) : catches.length === 0 ? (
                <p>Brak złowionych ryb tego gatunku.</p>
              ) : (
                <ul className="max-h-60 overflow-y-auto">
                  {catches.map((catchData, index) => (
                    <li key={index} className="border-b py-2">
                      <strong>{catchData.user}</strong>: {catchData.length} cm,{" "}
                      {catchData.weight} kg, {catchData.date}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleClosePopup}
                className="bg-red-500 hover:cursor-pointer hover:bg-red-700 duration-150 transition-colors text-white px-4 py-2 rounded-lg w-full mt-4"
              >
                Zamknij
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="w-full h-32 flex justify-center items-center text-center"></section>
      <Footer />
    </div>
  );
};

export default WebApp;
