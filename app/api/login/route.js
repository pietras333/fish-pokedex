import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON input" },
        { status: 400 }
      );
    }

    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fishPokedex");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { username },
      { projection: { password: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful!", user: { username } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "nodejs",
};
