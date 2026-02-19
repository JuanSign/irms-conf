import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // REGULAR USER PROVIDER
    Credentials({
      id: "user-login", // Explicit ID
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) return null;

        const passwordsMatch = await compare(credentials.password as string, user.passwordHash);
        if (!passwordsMatch) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          affiliation: user.affiliation,
          role: "user",
        };
      },
    }),

    // ADMIN PROVIDER
    Credentials({
      id: "admin-login", // Explicit ID for the admin portal
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const admin = await db.query.admins.findFirst({
          where: eq(admins.username, credentials.username as string),
        });

        if (!admin) return null;

        const passwordsMatch = await compare(credentials.password as string, admin.passwordHash);
        if (!passwordsMatch) return null;

        return {
          id: admin.id.toString(),
          name: admin.username,
          role: "admin",
          adminType: admin.type,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // User specific
        if (user.affiliation) token.affiliation = user.affiliation;
        // Admin specific
        if (user.adminType !== undefined) token.adminType = user.adminType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
        session.user.affiliation = token.affiliation as string | undefined;
        session.user.adminType = token.adminType as number | undefined;
      }
      return session;
    }
  },
});