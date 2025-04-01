import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, comment } = await req.json();
    if (!postId || !comment)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("fishPokedex");

    const newComment = {
      author: session.user.username,
      avatar: session.user.image || "",
      text: comment,
      date: new Date().toISOString(),
    };

    await db
      .collection("huntedFishes")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: newComment } }
      );

    return NextResponse.json({ message: "Comment added" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
