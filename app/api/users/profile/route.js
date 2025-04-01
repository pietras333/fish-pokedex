import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    // Extract query parameters correctly
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username"); // Get 'username' from query params

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("fishPokedex");
    const usersCollection = db.collection("users");

    // Fetch user data from MongoDB by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found", username }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the user data
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/users/profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  runtime: "edge",
};
