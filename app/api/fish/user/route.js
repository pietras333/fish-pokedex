import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("fishPokedex");

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    const species = searchParams.get("species");

    if (!user) {
      return NextResponse.json(
        { error: "User parameter is required" },
        { status: 400 }
      );
    }

    // Build the query to filter by user and optionally by species
    const query = { user };
    if (species) {
      query.species = species;
    }

    const catches = await db
      .collection("huntedFishes")
      .find(query)
      .sort({ date: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(catches, { status: 200 });
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
