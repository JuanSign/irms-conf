import { DefaultSession } from "next-auth";

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      affiliation?: string | null;
      adminType?: number | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "user" | "admin";
    affiliation?: string | null;
    adminType?: number | null;
  }
}

// Extend the built-in JWT type for Auth.js
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
    affiliation?: string | null;
    adminType?: number | null;
  }
}