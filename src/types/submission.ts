import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      affiliation?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    affiliation?: string | null;
  }
}

// Extend the built-in JWT type for Auth.js v5
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    affiliation?: string | null;
  }
}

// Type for the Search Results & Co-Authors
export interface AuthorSearchResult {
  id: string;
  name: string;
  email: string;
  affiliation: string | null;
}

// Type for the Abstract from the Database
export interface AbstractSubmission {
  id: string;
  writerId: string;
  title: string;
  topic: string;
  path: string;
  status: string;
  createdAt: Date;
}