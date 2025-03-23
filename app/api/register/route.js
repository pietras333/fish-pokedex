import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Use bcryptjs for better compatibility
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    if (!client) {
      console.error("MongoDB connection failed");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const db = client.db("fishPokedex");
    const usersCollection = db.collection("users");

    console.log("Connected to database successfully");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Save user to database
    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
    });
    console.log("User inserted:", result);

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/register:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export const config = {
  runtime: "nodejs",
};
