import { DefaultSession } from "next-auth";

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      affiliation?: string | null;
      adminRole?: "Super Admin" | "Reviewer" | null; // Changed from adminType
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "user" | "admin";
    affiliation?: string | null;
    adminRole?: "Super Admin" | "Reviewer" | null; // Changed from adminType
  }
}

// Extend the built-in JWT type for Auth.js
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
    affiliation?: string | null;
    adminRole?: "Super Admin" | "Reviewer" | null; // Changed from adminType
  }
}