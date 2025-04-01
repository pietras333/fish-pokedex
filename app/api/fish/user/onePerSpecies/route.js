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

    // Aggregate query to return one catch per species for the given user
    const catches = await db
      .collection("huntedFishes")
      .aggregate([
        { $match: { user } },
        { $group: { _id: "$species", catch: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$catch" } },
        { $sort: { date: -1 } },
        { $limit: 50 },
      ])
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
