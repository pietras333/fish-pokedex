"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import speciesData from "@/data/species.json";
import { FaCheck, FaFish, FaPlus, FaTimes } from "react-icons/fa";

const PostAddForm = ({ setElementVisibility, session, setFish, fish }) => {
  const [postContent, setPostContent] = useState({
    species: "",
    weight: "",
    length: "",
    catchDate: "",
    user: session?.user?.username || "",
    content: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
  };

  const savePost = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!postContent.species) {
      setMessage("Wybierz gatunek ryby!");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: postContent.species,
          weight: parseFloat(postContent.weight) || 0,
          length: parseFloat(postContent.length) || 0,
          catchDate: postContent.catchDate,
          user: postContent.user,
          content: postContent.content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Nie udało się dodać ryby.");
        return;
      }

      setMessage("Ryba dodana pomyślnie!");
      setPostContent({
        species: "",
        weight: "",
        length: "",
        catchDate: "",
        user: session?.user?.username || "",
        content: "",
      });
      setElementVisibility(false);
    } catch (error) {
      console.error("Błąd:", error);
      setMessage("Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-fit bg-white mt-4 p-8 shadow-xl rounded-xl flex flex-col items-center gap-y-4"
    >
      <section className="flex w-full gap-x-8 items-center">
        <h2 className="text-2xl">Dodaj wpis</h2>
        <FaPlus className="text-2xl" />
      </section>
      {message && <p className="text-red-500">{message}</p>}
      <form onSubmit={savePost} className="w-full flex flex-col gap-y-4">
        <section className="flex w-full gap-x-8 items-center">
          <h3 className="text-xl bg-gray-200 p-4 rounded-xl">Wiadomość</h3>
          <input
            type="text"
            name="content"
            value={postContent.content}
            onChange={handleChange}
            placeholder="Treść wiadomości"
            className="w-full p-2 py-4 rounded-xl border border-gray-200 text-lg"
          />
        </section>
        <section className="flex w-full gap-x-8 items-center">
          <h3 className="text-xl bg-gray-200 p-4 rounded-xl">Gatunek</h3>
          <select
            name="species"
            value={postContent.species}
            onChange={handleChange}
            className="text-lg p-4 hover:cursor-pointer border border-gray-200 rounded-xl"
          >
            <option value="">Wybierz gatunek</option>
            {Object.keys(speciesData).map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </section>
        <section className="flex w-full gap-x-8 items-center">
          <h3 className="text-xl bg-gray-200 p-4 rounded-xl">Waga</h3>
          <input
            type="number"
            name="weight"
            value={postContent.weight}
            onChange={handleChange}
            placeholder="Np. 10kg"
            className="w-full p-2 py-4 rounded-xl border border-gray-200 text-lg"
          />
        </section>
        <section className="flex w-full gap-x-8 items-center">
          <h3 className="text-xl bg-gray-200 p-4 rounded-xl">Długość</h3>
          <input
            type="number"
            name="length"
            value={postContent.length}
            onChange={handleChange}
            placeholder="Np. 100cm"
            className="w-full p-2 py-4 rounded-xl border border-gray-200 text-lg"
          />
        </section>
        <section className="flex w-full gap-x-8 items-center">
          <h3 className="text-xl bg-gray-200 p-4 rounded-xl">Data połowu</h3>
          <input
            type="date"
            name="catchDate"
            value={postContent.catchDate}
            onChange={handleChange}
            className="w-fit hover:cursor-pointer p-2 py-4 rounded-xl border border-gray-200 text-lg"
          />
        </section>
        <section className="flex w-full justify-end gap-x-8 items-center">
          <button
            type="submit"
            className="p-4 px-8 hover:cursor-pointer bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300"
          >
            <FaCheck className="text-2xl" />
          </button>
          <button
            type="button"
            onClick={() => setElementVisibility(false)}
            className="p-4 px-8 hover:cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
          >
            <FaTimes className="text-2xl" />
          </button>
        </section>
      </form>
    </motion.section>
  );
};

export default PostAddForm;
