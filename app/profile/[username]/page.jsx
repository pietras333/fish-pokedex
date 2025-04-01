// app/profile/[username]/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import Image from "next/image";
import {
  FaUser,
  FaBullhorn,
  FaStar,
  FaThList,
  FaFish,
  FaMedal,
  FaRuler,
  FaWeight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import speciesData from "@/data/species.json";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const searchParams = useSearchParams(); // This gives access to the search params
  const username = searchParams.get("username"); // Get 'username' from the query params
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [fishPerSpecies, setFishPerSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rareFishes, setRareFishes] = useState({});
  const [fishMedals, setFishMedals] = useState({});
  const [showFishPopup, setShowFishPopup] = useState({});
  const [selectedFish, setSelectedFish] = useState(null);
  const [catches, setCatches] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (!username) return; // Don't fetch if username is not available

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/profile?username=${username}`);

        if (!res.ok) {
          throw new Error("User not found");
        }
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUserFish = async () => {
      try {
        const response = await fetch(`/api/fish?user=${username}`);
        if (!response.ok) throw new Error("Failed to fetch fish data");

        const data = await response.json();
        setFishes(data);
      } catch (error) {
        console.error("Error fetching fish:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOneFishPerSpecies = async () => {
      try {
        const response = await fetch(
          `/api/fish/user/onePerSpecies?user=${username}`
        );
        if (!response.ok) throw new Error("Błąd pobierania danych");

        const data = await response.json();
        setFishPerSpecies(data);
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRecords = async () => {
      try {
        const response = await fetch(
          `/api/fish/user/userRecords?user=${username}`
        );
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        console.log(data);
        setRareFishes(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    const fetchUserMedalFishes = async () => {
      try {
        const response = await fetch(
          `/api/fish/user/fishMedal?user=${username}`
        );
        if (!response.ok) throw new Error("Failed to fetch medal fishes");
        const data = await response.json();
        console.log(data);
        // setRareFishes(data);
        setFishMedals(data);
      } catch (error) {
        console.error("Error fetching medal fishes:", error);
      }
    };
    fetchUserMedalFishes();
    fetchUserRecords();
    fetchOneFishPerSpecies();
    fetchUserFish();
    fetchUser();
  }, [username]);

  const hasSpecies = (species) => {
    if (Array.isArray(fishPerSpecies)) {
      return fishPerSpecies.some((fish) => fish.species === species);
    }
    return species in fishPerSpecies;
  };
  const filterMedalFishes = (medal) => {
    // Assuming `data` is the object containing `medalFishes`:
    if (Array.isArray(fishMedals.medalFishes)) {
      return fishMedals.medalFishes.filter((fish) => fish.medal === medal);
    } else {
      console.error("medalFishes is not an array or data is undefined");
      return []; // Return an empty array if `medalFishes` is not an array
    }
  };

  const handleSelectFish = async (species) => {
    setSelectedFish(species);
    // setLoadingCatches(true);
    setShowFishPopup(true);

    try {
      const res = await fetch(`/api/fish?species=${species}`);
      const data = await res.json();
      setCatches(data.sort((a, b) => b.length - a.length)); // Sortowanie malejąco po długości
    } catch (error) {
      console.error("Error fetching catches:", error);
      setCatches([]);
    }

    // setLoadingCatches(false);
  };

  const handleClosePopup = () => {
    setShowFishPopup(false);
    setSelectedFish(null);
  };

  console.log(fishMedals);

  if (error) return <div>{error}</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <section className="bg-gray-100 h-dvh w-full max-xl:flex-col flex">
      <AnimatePresence>
        {showFishPopup && selectedFish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 max-xl:w-full max-xl:h-dvh max-xl:max-h-dvh max-xl:bg-gray-100 bg-opacity-50 z-20 flex justify-center items-center"
          >
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg max-xl:max-w-full max-xl:max-h-dvh w-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {selectedFish}
              </h2>
              <Image
                src={
                  hasSpecies(selectedFish)
                    ? speciesData[selectedFish].image
                    : speciesData[selectedFish].grayImage
                }
                width={300}
                height={200}
                alt={selectedFish}
                className={`rounded-lg mx-auto mb-4 ${
                  hasSpecies(selectedFish) ? "opacity-100" : "opacity-25"
                }`}
              />
              <h4 className="w-full text-start text-lg">Opis</h4>
              {/* <p>{getSpeciesDescription(selectedFish)}</p> */}
              <h3 className="text-lg font-semibold mb-2">🏆 Ranking połowów</h3>
              {/* <h2 className="text-base font-normal mb-2">
                Złapano {getSpeciesCount(selectedFish)} przedstawicieli tego
                gatunku.
              </h2> */}
              {loading ? (
                <p>Ładowanie...</p>
              ) : catches.length === 0 ? (
                <p>Brak złowionych ryb tego gatunku.</p>
              ) : (
                <ul className="max-h-60 max-xl:max-h-30 overflow-y-auto">
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

      <nav className="w-96 max-xl:h-fit max-xl:w-full h-full bg-white border-r border-gray-200">
        <ul className="flex flex-col h-fit w-full">
          <a href="/webapp">
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <Image
                alt="Fishdecks logo"
                src="/images/logo.svg"
                width={32}
                height={32}
              />
              <h1 className="font-medium text-2xl text-gray-800">Fishdecks</h1>
            </li>
          </a>

          <li className="w-full h-fit p-4 flex items-center gap-x-4">
            <h2 className="text-xl font-medium">Menu główne</h2>
          </li>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href="/webapp"
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaBullhorn className="text-2xl" />
              <h3 className="text-xl font-medium">Feed</h3>
            </li>
          </a>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href="/webapp/records"
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaStar className="text-2xl" />
              <h3 className="text-xl font-medium">Rekordziści</h3>
            </li>
          </a>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href={`/profile/${session?.data?.user?.username}?username=${session?.data?.user?.username}`}
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaUser className="text-2xl" />
              <h3 className="text-xl font-medium">Profil</h3>
            </li>
          </a>
        </ul>
      </nav>
      {/* <h1>{user.username}'s Profile</h1> */}
      {/* <p>Username: {user.username}</p> */}
      {/* <p>Password (hashed): {user.password}</p>{" "} */}
      {/* Don't show this in production! */}
      {/* You can replace the above with more useful data like email, avatar, etc. */}
      <section className="w-full h-full overflow-y-auto flex flex-col items-center p-8 text-gray-800">
        <section className="w-full h-fit p-4 flex items-center gap-x-4">
          <FaUser className="text-2xl" />
          <h1 className="text-3xl font-medium">{username}</h1>
        </section>
        {/* Pokedex */}
        <section className="w-full h-fit p-4 flex items-center gap-x-4">
          <FaFish className="text-2xl" />
          <h2 className="text-2xl font-medium">Fishdeck</h2>
        </section>
        <section className="w-full h-fit p-4 flex items-center gap-x-4">
          <div className="flex gap-4 overflow-y-auto flex-wrap max-xl:justify-center mt-4">
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
                    hasSpecies(species)
                      ? speciesData[species].image
                      : speciesData[species].grayImage
                  }
                  className={hasSpecies(species) ? "opacity-100" : "opacity-25"}
                  alt={species}
                  width={64}
                  height={64}
                />
              </motion.div>
            ))}
          </div>
        </section>
        <section className="w-full h-fit p-4 flex items-center gap-x-4">
          <FaStar className="text-2xl" />
          <h3 className="text-2xl font-medium">Rekordy personalne</h3>
        </section>
        <section className="flex w-full max-xl:flex-col max-xl:gap-y-4 h-fit gap-x-8">
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaRuler className="text-xl" />
              <h3 className="text-xl font-medium">Najdłuższe ryby</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {rareFishes?.longestFishes?.map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaWeight className="text-xl" />
              <h3 className="text-xl font-medium">Najcięższe ryby</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {rareFishes?.heaviestFishes?.map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaStar className="text-xl" />
              <h3 className="text-xl font-medium">
                Najbardziej unikatowe ryby
              </h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {rareFishes?.rarestFishes?.map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.rarityPercentage} użytkowników złapało
                  ten gatunek
                </li>
              ))}
            </ul>
          </section>
        </section>
        <section className="w-full h-fit p-4 flex items-center gap-x-4">
          <FaMedal className="text-2xl" />
          <h3 className="text-2xl font-medium">Zdobyte medale</h3>
        </section>
        <section className="flex w-full max-xl:flex-col max-xl:gap-y-4 h-fit gap-x-8">
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-blue-500" />
              <h3 className="text-xl font-medium">Diamentowe medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("💎 Diamentowa ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-yellow-500" />
              <h3 className="text-xl font-medium">Złote medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("🥇 Złotomedalowa ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-gray-300" />
              <h3 className="text-xl font-medium">Platynowe medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("🥇 Platynowa ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-gray-500" />
              <h3 className="text-xl font-medium">Srebrne medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("🥈 Srebrnomedalowa ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-amber-600" />
              <h3 className="text-xl font-medium">Miedziane medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("🏅 Miedziana ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
          <section className="w-full h-fit bg-white rounded-xl p-4 flex flex-col gap-y-4">
            <section className="flex items-center gap-x-4">
              <FaMedal className="text-xl text-amber-600" />
              <h3 className="text-xl font-medium">Brązowe medale</h3>
            </section>
            <section className="w-full h-fit px-4">
              <hr className="border-gray-200" />
            </section>
            <ul className="text-lg">
              {filterMedalFishes("🥉 Brązowomedalowa ryba").map((fish) => (
                <li key={fish._id}>
                  {fish.species}, {fish.length}cm, {fish.weight}kg
                </li>
              ))}
            </ul>
          </section>
        </section>
      </section>
    </section>
  );
}
