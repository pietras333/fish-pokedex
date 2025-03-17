"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import speciesData from "@/data/species.json";

const FishPokedex = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fish, setFish] = useState([]);
  const [latestCatches, setLatestCatches] = useState([]);
  const [newFish, setNewFish] = useState({
    species: "",
    weight: "",
    length: "",
  });
  const [message, setMessage] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);

  const [catches, setCatches] = useState([]);
  const [loadingCatches, setLoadingCatches] = useState(false);

  const handleSelectFish = async (species) => {
    setSelectedFish(species);
    setLoadingCatches(true);

    try {
      const res = await fetch(`/api/fish?species=${species}`);
      const data = await res.json();
      setCatches(data);
    } catch (error) {
      console.error("Error fetching catches:", error);
      setCatches([]);
    }

    setLoadingCatches(false);
  };

  useEffect(() => {
    // Fetch all user's catches
    fetch("/api/fish")
      .then((res) => res.json())
      .then((data) => setFish(data));

    // Fetch latest 20 catches
    fetch("/api/fish")
      .then((res) => res.json())
      .then((data) => setLatestCatches(data));
  }, []);

  if (status === "loading")
    return <p className="text-center mt-10">Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleChange = (e) => {
    setNewFish({ ...newFish, [e.target.name]: e.target.value });
  };

  const handleAddFish = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newFish.species) {
      setMessage("Please select a species!");
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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to add fish.");
        return;
      }

      setFish([...fish, { ...newFish, date: new Date().toISOString() }]);
      setMessage("Fish added successfully!");
      setNewFish({ species: "", weight: "", length: "" });
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const caughtSpecies = new Set(fish.map((f) => f.species));

  return (
    <div className="min-h-dvh bg-gradient-to-br from-green-500 to-blue-400 text-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">🎣 Fish Pokedex</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      <p className="text-xl mt-2">Welcome, {session.user.username}!</p>
      {/* Split Layout */}
      <div className="flex gap-6 mt-6">
        {/* Main Content */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md text-black">
          <h2 className="text-2xl font-bold mb-4">🐟 Add a Fish</h2>
          <form onSubmit={handleAddFish} className="space-y-3">
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <select
              name="species"
              onChange={handleChange}
              value={newFish.species}
              className="w-full p-2 border"
            >
              <option value="">Select Fish</option>
              {Object.keys(speciesData).map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={newFish.weight}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
            <input
              type="number"
              name="length"
              placeholder="Length (cm)"
              value={newFish.length}
              onChange={handleChange}
              className="w-full p-2 border"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 text-white rounded-lg"
            >
              Add Fish
            </button>
          </form>
          {/* Pokedex Grid */}
          <h2 className="text-2xl font-bold mt-6 mb-6">📖 Pokedex</h2>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(speciesData).map((species) => (
              <div
                key={species}
                className="cursor-pointer w-32 h-32 bg-pink-300 flex justify-center items-center"
                onClick={() => handleSelectFish(species)}
              >
                {/* <Image
                  src={
                    caughtSpecies.has(species)
                      ? speciesData[species].image
                      : speciesData[species].greyImage
                  }
                  alt={species}
                  width={100}
                  height={100}
                /> */}

                <p
                  className={`text-center font-semibold ${
                    caughtSpecies.has(species) ? "opacity-100" : "opacity-25"
                  }`}
                >
                  {species}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & Activity */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md text-black">
          <h2 className="text-2xl font-bold">👤 Profile</h2>
          <p className="mt-2 font-semibold">{session.user.username}</p>
          {/* Latest Activity */}
          <h2 className="text-2xl font-bold mt-6">📰 Latest Catches</h2>
          <ul className="mt-2">
            {latestCatches.map((catchData, index) => (
              <li key={index} className="border-b py-2">
                <strong>{catchData.user}</strong> caught a {catchData.species} (
                {catchData.length}cm, {catchData.weight}kg) on{" "}
                {new Date(catchData.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Fish Details Popup */}
      {selectedFish && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button
              onClick={() => setSelectedFish(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-center">{selectedFish}</h2>
            <div className="flex justify-center">
              <Image
                src={speciesData[selectedFish]?.image}
                alt={selectedFish}
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
            <p className="mt-2">{speciesData[selectedFish]?.description}</p>

            {/* Catches List */}
            <h3 className="text-lg font-semibold mt-4">🎣 Catches</h3>
            {loadingCatches ? (
              <p className="text-center mt-2">Loading catches...</p>
            ) : catches.length > 0 ? (
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {catches.map((catchData, index) => (
                  <li key={index} className="border-b py-2">
                    <strong>{catchData.user}</strong> caught a{" "}
                    {catchData.species} ({catchData.length}cm,{" "}
                    {catchData.weight}kg) on{" "}
                    {new Date(catchData.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center mt-2">
                No catches found for this species.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FishPokedex;
