"use client";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Navbar from "@/components/AppNavbar";
// import Footer from "@/components/Footer";
// import speciesData from "@/data/species.json";
// import { AnimatePresence, motion } from "framer-motion";

// const WebApp = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [fish, setFish] = useState([]);
//   const [latestCatches, setLatestCatches] = useState([]);
//   const [newFish, setNewFish] = useState({
//     species: "",
//     weight: "",
//     length: "",
//     date: "",
//   });
//   const [message, setMessage] = useState(null);
//   const [selectedFish, setSelectedFish] = useState(null);
//   const [catches, setCatches] = useState([]);
//   const [loadingCatches, setLoadingCatches] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     if (status === "loading") return;
//     if (!session) {
//       router.push("/login");
//       return;
//     }

//     fetch("/api/fish")
//       .then((res) => res.json())
//       .then((data) => setFish(data));

//     fetch("/api/fish?latest=true")
//       .then((res) => res.json())
//       .then((data) => setLatestCatches(data));
//   }, [session, status, router]);

//   const handleSelectFish = async (species) => {
//     setSelectedFish(species);
//     setLoadingCatches(true);
//     setShowPopup(true);

//     try {
//       const res = await fetch(`/api/fish?species=${species}`);
//       const data = await res.json();
//       setCatches(data.sort((a, b) => b.length - a.length)); // Sortowanie malejąco po długości
//     } catch (error) {
//       console.error("Error fetching catches:", error);
//       setCatches([]);
//     }

//     setLoadingCatches(false);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setSelectedFish(null);
//   };

//   const handleChange = (e) => {
//     setNewFish({ ...newFish, [e.target.name]: e.target.value });
//   };

//   const handleAddFish = async (e) => {
//     e.preventDefault();
//     setMessage(null);

//     if (!newFish.species) {
//       setMessage("Wybierz gatunek ryby!");
//       return;
//     }

//     try {
//       const res = await fetch("/api/fish", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           species: newFish.species,
//           weight: parseFloat(newFish.weight) || 0,
//           length: parseFloat(newFish.length) || 0,
//           date: newFish.date,
//           user: session?.user?.username, // Dodanie użytkownika do rekordu połowu
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.error || "Nie udało się dodać ryby.");
//         return;
//       }

//       setFish([
//         ...fish,
//         {
//           ...newFish,
//           date: new Date().toISOString(),
//           user: session?.user?.username,
//         },
//       ]);
//       setMessage("Ryba dodana pomyślnie!");
//       setNewFish({ species: "", weight: "", length: "" });
//     } catch (error) {
//       console.error("Błąd:", error);
//       setMessage("Coś poszło nie tak. Spróbuj ponownie.");
//     }
//   };

//   // Zestaw złowionych gatunków TYLKO przez aktualnego użytkownika
//   const caughtSpeciesByUser = new Set(
//     fish.filter((f) => f.user === session?.user?.username).map((f) => f.species)
//   );

//   function getSpeciesCount(speciesName) {
//     return fish.filter(
//       (f) => f.user === session?.user?.username && f.species === speciesName
//     ).length;
//   }

//   function getSpeciesDescription(speciesName) {
//     const species = speciesData[speciesName];
//     return species ? species.description : "Brak opisu.";
//   }

//   return (
//     <div className="min-h-dvh flex flex-col">
//       <Navbar />
//       <section className="flex flex-col items-center justify-center flex-grow p-6 max-w-4xl mx-auto text-gray-700">
//         <div className="flex justify-between w-full mb-6 max-xl:mt-32">
//           <h1 className="text-3xl font-bold text-blue-700">🎣 Fish Pokedex</h1>
//           <button
//             onClick={() => signOut()}
//             className="bg-red-500 hover:cursor-pointer hover:bg-red-700 transition-colors duration-300 px-4 py-2 rounded-lg text-white"
//           >
//             Wyloguj się
//           </button>
//         </div>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-xl"
//         >
//           Witaj, {session?.user?.username}!
//         </motion.p>

//         <section className="grid grid-cols-1 md:grid-cols-3 max-xl:flex max-xl:flex-col gap-6 w-full mt-6">
//           {/* Formularz dodawania ryby */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             duration={0.5}
//             delay={0.5}
//             className="bg-white p-6 rounded-lg shadow-md col-span-2"
//           >
//             <h2 className="text-2xl font-bold mb-4">🐟 Dodaj nową rybę</h2>
//             {message && <p className="text-red-500 text-sm">{message}</p>}
//             <form onSubmit={handleAddFish} className="space-y-3">
//               <select
//                 name="species"
//                 onChange={handleChange}
//                 value={newFish.species}
//                 className="w-full p-2 border rounded-lg"
//               >
//                 <option value="">Wybierz gatunek</option>
//                 {Object.keys(speciesData).map((species) => (
//                   <option key={species} value={species}>
//                     {species}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 name="weight"
//                 placeholder="Waga (kg)"
//                 value={newFish.weight}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-lg"
//                 required
//               />
//               <input
//                 type="number"
//                 name="length"
//                 placeholder="Długość (cm)"
//                 value={newFish.length}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-lg"
//                 required
//               />
//               <input
//                 type="date"
//                 name="date"
//                 value={newFish.date}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-lg"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-colors duration-300 text-white px-4 py-2 rounded-lg w-full"
//               >
//                 Dodaj rybę
//               </button>
//             </form>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white p-6 rounded-lg shadow-md"
//           >
//             <h2 className="text-2xl font-bold">📰 Ostatnie połowy</h2>
//             <ul className="mt-2 max-h-52 overflow-y-auto">
//               {latestCatches.map((catchData, index) => (
//                 <li key={index} className="border-b py-2">
//                   <strong>{catchData.user}</strong> złowił {catchData.species} (
//                   {catchData.length}cm, {catchData.weight}
//                   kg){" "}
//                   <span className="text-sm">
//                     {new Date(catchData.date).toLocaleDateString()}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         </section>

//         <h2 className="text-2xl font-bold mt-8">📖 Fishdeck</h2>
//         <div className="flex gap-4 flex-wrap max-xl:justify-center mt-4">
//           {Object.keys(speciesData).map((species, index) => (
//             <motion.div
//               key={species}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl w-32 h-32 bg-gray-300 flex justify-center items-center rounded-lg shadow-md"
//               onClick={() => handleSelectFish(species)}
//             >
//               <Image
//                 src={
//                   caughtSpeciesByUser.has(species)
//                     ? speciesData[species].image
//                     : speciesData[species].grayImage
//                 }
//                 className={
//                   caughtSpeciesByUser.has(species)
//                     ? "opacity-100"
//                     : "opacity-25"
//                 }
//                 alt={species}
//                 width={64}
//                 height={64}
//               />
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* POPUP */}
//       <AnimatePresence>
//         {showPopup && selectedFish && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-opacity-50 flex justify-center items-center"
//           >
//             <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
//               <h2 className="text-2xl font-bold mb-4 text-center">
//                 {selectedFish}
//               </h2>
//               <Image
//                 src={
//                   caughtSpeciesByUser.has(selectedFish)
//                     ? speciesData[selectedFish].image
//                     : speciesData[selectedFish].grayImage
//                 }
//                 width={300}
//                 height={200}
//                 alt={selectedFish}
//                 className={`rounded-lg mx-auto mb-4 ${
//                   caughtSpeciesByUser.has(selectedFish)
//                     ? "opacity-100"
//                     : "opacity-25"
//                 }`}
//               />
//               <h4 className="w-full text-start text-lg">Opis</h4>
//               <p>{getSpeciesDescription(selectedFish)}</p>
//               <h3 className="text-lg font-semibold mb-2">🏆 Ranking połowów</h3>
//               <h2 className="text-base font-normal mb-2">
//                 Złapano {getSpeciesCount(selectedFish)} przedstawicieli tego
//                 gatunku.
//               </h2>
//               {loadingCatches ? (
//                 <p>Ładowanie...</p>
//               ) : catches.length === 0 ? (
//                 <p>Brak złowionych ryb tego gatunku.</p>
//               ) : (
//                 <ul className="max-h-60 overflow-y-auto">
//                   {catches.map((catchData, index) => (
//                     <li key={index} className="border-b py-2">
//                       <strong>{catchData.user}</strong>: {catchData.length} cm,{" "}
//                       {catchData.weight} kg, {catchData.date}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//               <button
//                 onClick={handleClosePopup}
//                 className="bg-red-500 hover:cursor-pointer hover:bg-red-700 duration-150 transition-colors text-white px-4 py-2 rounded-lg w-full mt-4"
//               >
//                 Zamknij
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <section className="w-full h-32 flex justify-center items-center text-center"></section>
//       <Footer />
//     </div>
//   );
// };

// export default WebApp;

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import AnimatedHeading from "@/components/AnimatedHeading";
import Post from "@/components/Post";
import ActiveFriend from "@/components/ActiveFriend";
import Quest from "@/components/Quest";
import { motion, AnimatePresence } from "framer-motion";
import speciesData from "@/data/species.json";

const WebApp = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [newFish, setNewFish] = useState({
    species: "",
    weight: "",
    length: "",
    date: "",
  });
  const [fish, setFish] = useState([]);

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const [activeUsers, setActiveUsers] = useState([]);
  const [activeUsersLoading, setActiveUsersLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await fetch("/api/users/active");
        const data = await res.json();

        if (Array.isArray(data)) {
          console.log("Active users:", data);
          setActiveUsers(data);
        } else {
          console.error("Invalid API response:", data);
          setActiveUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch active users:", error);
      } finally {
        setActiveUsersLoading(false);
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setLatestPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [session, status, router]);

  const addComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch("/api/posts/comment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          comment: commentText,
        }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLatestPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await fetch("/api/posts/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLatestPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddFish = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newFish.species) {
      setMessage("Wybierz gatunek ryby!");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: newFish.species,
          weight: parseFloat(newFish.weight) || 0,
          length: parseFloat(newFish.length) || 0,
          catchDate: newFish.date,
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
  const handleChange = (e) => {
    setNewFish({ ...newFish, [e.target.name]: e.target.value });
  };

  return (
    <section className="w-full h-dvh flex flex-col">
      <Navbar togglePopup={togglePopup} />
      {/* POPUP */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center"
          >
            <section className="w-fit h-fit bg-[#efefef] p-10 rounded-xl shadow-lg">
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
                  value={newFish.date || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                <section className="w-full flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-colors duration-300 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Dodaj rybę
                  </button>
                  <button
                    onClick={togglePopup}
                    className="bg-red-600 hover:cursor-pointer hover:bg-red-700 transition-colors duration-300 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Anuluj
                  </button>
                </section>
              </form>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="w-full h-4/5 flex">
        <section className="w-1/4 h-full max-h-full flex flex-col items-center gap-4 overflow-y-auto">
          <h2 className="p-4 text-3xl w-full max-lg:text-center max-lg:text-2xl h-fit font-bold text-green-500 leading-tight">
            Sezonowe zadania
          </h2>
          <ul className="w-full h-fit flex flex-col items-center gap-y-4 overflow-y-auto">
            {[
              {
                name: "Złów 5 ryb",
                progress: 5,
                goal: 5,
                description: "Złów 5 ryb dowolnego gatunku.",
              },
              {
                name: "Złów 10 ryb",
                progress: 3,
                goal: 10,
                description: "Złów 10 ryb dowolnego gatunku.",
              },
              {
                name: "Złów 15 ryb",
                progress: 3,
                goal: 15,
                description: "Złów 15 ryb dowolnego gatunku.",
              },
              {
                name: "Złów 20 ryb",
                progress: 3,
                goal: 20,
                description: "Złów 20 ryb dowolnego gatunku.",
              },
            ].map((quest) => (
              <Quest key={quest.name} quest={quest} />
            ))}
          </ul>
        </section>
        <main className="w-2/4 h-full flex flex-col items-center">
          <AnimatedHeading text={"Ostatnie wpisy i komentarze"} />
          <section className="w-full flex flex-col items-center overflow-y-scroll px-2">
            {loading ? (
              <p className="text-gray-500">Ładowanie wpisów...</p>
            ) : latestPosts.length === 0 ? (
              <p className="text-gray-500">Brak postów do wyświetlenia.</p>
            ) : (
              latestPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  addComment={addComment}
                  likePost={likePost}
                />
              ))
            )}
          </section>
        </main>
        <section className="w-1/4 h-full max-h-full flex flex-col items-center gap-4 overflow-y-auto">
          <h2 className="p-4 text-3xl w-full max-lg:text-center max-lg:text-2xl h-fit font-bold text-green-500 leading-tight">
            Znajomi online
          </h2>
          {activeUsersLoading ? (
            <p>Loading...</p>
          ) : activeUsers.length === 0 ? (
            <p>No active users</p>
          ) : (
            <ul className="w-full h-fit flex flex-col gap-y-4">
              {activeUsers.map((user) => (
                <ActiveFriend key={user._id} username={user.username} />
              ))}
            </ul>
          )}
        </section>
      </section>
      {/* <Footer /> */}
    </section>
  );
};

export default WebApp;
