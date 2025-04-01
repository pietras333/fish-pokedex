import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("fishPokedex");
  const usersCollection = db.collection("users");

  const activeUsers = await usersCollection
    .find({ isOnline: true })
    .project({ username: 1 })
    .toArray();

  return Response.json(activeUsers);
}
