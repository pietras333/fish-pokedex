"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const fishSpecies = ["Pike", "Perch", "Carp", "Trout", "Zander"];

const AddFish = () => {
  const { data: session } = useSession();
  const [fish, setFish] = useState({ species: "", weight: "", length: "" });
  const [message, setMessage] = useState(null);

  if (!session) return <p>You must be logged in to add fish.</p>;

  const handleChange = (e) =>
    setFish({ ...fish, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/fish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fish),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <h2>Add Hunted Fish</h2>
      <form onSubmit={handleSubmit}>
        <select name="species" onChange={handleChange} required>
          <option value="">Select Fish</option>
          {fishSpecies.map((fish) => (
            <option key={fish} value={fish}>
              {fish}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="length"
          placeholder="Length (cm)"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddFish;
