import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("fishPokedex");

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json(
        { error: "User parameter is required" },
        { status: 400 }
      );
    }

    // Fetch top 3 longest fish
    const longestFishes = await db
      .collection("huntedFishes")
      .find({ user })
      .sort({ length: -1 })
      .limit(3)
      .toArray();

    // Fetch top 3 heaviest fish
    const heaviestFishes = await db
      .collection("huntedFishes")
      .find({ user })
      .sort({ weight: -1 })
      .limit(3)
      .toArray();

    // Count total users who caught fish
    const totalUsers = await db.collection("huntedFishes").distinct("user");
    const totalUserCount = totalUsers.length;

    // Find rarest fish species based on the number of unique users who caught them
    const rareSpecies = await db
      .collection("huntedFishes")
      .aggregate([
        { $group: { _id: "$species", uniqueUsers: { $addToSet: "$user" } } },
        { $project: { _id: 1, userCount: { $size: "$uniqueUsers" } } },
        { $sort: { userCount: 1 } },
        { $limit: 10 },
      ])
      .toArray();

    // Extract species names
    const rareSpeciesNames = rareSpecies.map((species) => species._id);

    // Fetch the user's rarest fish matching those species
    const userRarestFishes = await db
      .collection("huntedFishes")
      .find({ user, species: { $in: rareSpeciesNames } })
      .toArray();

    // Attach rarity percentage to each rare fish
    const rarestFishes = userRarestFishes
      .map((fish) => {
        const speciesData = rareSpecies.find(
          (species) => species._id === fish.species
        );
        return {
          ...fish,
          rarityPercentage: speciesData
            ? ((speciesData.userCount / totalUserCount) * 100).toFixed(2) + "%"
            : "N/A",
        };
      })
      .slice(0, 3); // Limit to top 3 rarest fish

    return NextResponse.json(
      { longestFishes, heaviestFishes, rarestFishes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "nodejs",
};
