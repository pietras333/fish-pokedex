import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { species, weight, length, catchDate } = await req.json();
    if (!species)
      return NextResponse.json(
        { error: "Species is required" },
        { status: 400 }
      );

    const client = await clientPromise;
    const db = client.db("fishPokedex");

    const newPost = {
      user: session.user.username,
      userImage: session.user.image || "",
      species,
      weight,
      length,
      catchDate,
      postDate: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    await db.collection("huntedFishes").insertOne(newPost);

    return NextResponse.json({ message: "Fish recorded!" }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("fishPokedex");

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const species = searchParams.get("species");

    // Build the query
    const query = species ? { species } : {};

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
