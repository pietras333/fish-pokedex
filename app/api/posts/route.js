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

    // Remove species filtering for fetching latest 50 posts
    const query = {};

    const posts = await db
      .collection("huntedFishes")
      .find(query) // No species filter
      .sort({ postDate: -1 }) // Sort by most recent postDate
      .limit(50) // Limit to 50 posts
      .toArray();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
