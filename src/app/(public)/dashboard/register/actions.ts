"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const affiliation = formData.get("affiliation") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: "Name, email, and password are required." };
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Insert user into database
    await db.insert(users).values({
      name,
      email,
      affiliation: affiliation || null,
      passwordHash,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred during registration." };
  }
}