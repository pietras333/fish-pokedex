import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

    // Load species data from JSON file
    const speciesFilePath = path.resolve(process.cwd(), "data", "species.json");
    const speciesData = JSON.parse(fs.readFileSync(speciesFilePath, "utf8"));

    // Fetch all fish caught by the user
    const userFishes = await db
      .collection("huntedFishes")
      .find({ user })
      .toArray();

    // Function to determine medal based on percentage
    const getMedal = (percentage) => {
      if (percentage >= 90) return "💎 Diamentowa ryba";
      if (percentage >= 80) return "🏅 Złotomedalowa ryba";
      if (percentage >= 70) return "🥇 Platynowa ryba";
      if (percentage >= 60) return "🥈 Srebrnomedalowa ryba";
      if (percentage >= 50) return "🏅 Miedziana ryba";
      if (percentage >= 30) return "🥉 Brązowomedalowa ryba";
      return null;
    };

    // Assign medal to each fish based on its length and weight relative to records
    const medalFishes = userFishes
      .map((fish) => {
        const species = speciesData[fish.species]; // Get species data from the JSON file
        if (!species || !species.recordLength || !species.recordWeight)
          return null;

        const lengthPercentage = (
          (fish.length / species.recordLength) *
          100
        ).toFixed(2);
        const weightPercentage = (
          (fish.weight / species.recordWeight) *
          100
        ).toFixed(2);
        const overallPercentage = Math.max(lengthPercentage, weightPercentage);

        const medal = getMedal(overallPercentage);
        return medal
          ? { ...fish, lengthPercentage, weightPercentage, medal }
          : null;
      })
      .filter((fish) => fish !== null);

    return NextResponse.json({ medalFishes }, { status: 200 });
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
