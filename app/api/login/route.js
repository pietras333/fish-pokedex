import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    // Safely parse request body
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

    // Validate input fields
    if (!username || !password) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const db = client.db("fishPokedex");
    const usersCollection = db.collection("users");

    // Find user in database (projection to exclude password for security)
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

    // Compare hashed password (only if user exists)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Success response with user info (excluding sensitive data)
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
