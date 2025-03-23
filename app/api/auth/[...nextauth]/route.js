import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  session: {
    strategy: "jwt", // Use JWT for session storage
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

        // Find user by username
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

        return { id: user._id, username: user.username };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Store in .env.local
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export const config = {
  runtime: "nodejs",
};
