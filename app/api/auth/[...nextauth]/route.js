import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("fishPokedex");
        const usersCollection = db.collection("users");

        // Find user
        const user = await usersCollection.findOne({
          username: credentials.username,
        });
        if (!user) throw new Error("Invalid username or password");

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid username or password");

        // Mark user as online
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { isOnline: true, lastSeen: new Date() } }
        );

        return { id: user._id, username: user.username };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },
  // ✅ Detect when user logs out and update MongoDB
  events: {
    async signOut({ token }) {
      const client = await clientPromise;
      const db = client.db("fishPokedex");
      const usersCollection = db.collection("users");

      if (token?.user?.username) {
        await usersCollection.updateOne(
          { username: token.user.username },
          { $set: { isOnline: false, lastSeen: new Date() } }
        );
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
