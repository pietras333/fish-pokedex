import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("username");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    console.log("Received query:", query);

    const client = await clientPromise;
    const db = client.db("fishPokedex");
    const usersCollection = db.collection("users");

    console.log("Searching users with regex:", query);
    const users = await usersCollection
      .find({ username: { $regex: `^${query}`, $options: "i" } }) // Matches names starting with query
      .limit(3)
      .toArray();

    console.log("MongoDB query result:", users);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No matching users found" },
        { status: 404 }
      );
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error in /api/users/profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
