import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user in DB
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) return null; // User not found

        // Verify Password
        const passwordsMatch = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordsMatch) return null; // Incorrect password

        // Return user object to save in session
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          affiliation: user.affiliation,
        };
      },
    }),
  ],
  pages: {
    signIn: '/submission/register',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Transfer data from the authorize object to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.affiliation = user.affiliation;
      }
      return token;
    },
    // Transfer data from the JWT token to the active Session
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
        session.user.affiliation = token.affiliation;
      }
      return session;
    }
  },
});