"use server";

import { db } from "@/db";
import { admins, abstractAssignments, abstracts } from "@/db/schema";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "Super Admin" | "Reviewer";

  if (!name || !username || !password || !role) {
    return { error: "All fields are required" };
  }

  try {
    const passwordHash = await hash(password, 10);

    await db.insert(admins).values({
      name,
      username,
      passwordHash,
      role,
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    // Handle unique constraint errors (e.g., username already exists)
    if (error.code === '23505') {
      return { error: "Username already exists" };
    }
    return { error: "Failed to create admin" };
  }
}

export async function assignAbstract(adminId: string, abstractId: string) {
  if (!adminId || !abstractId) return { error: "Missing admin or abstract ID" };

  try {
    await db.insert(abstractAssignments)
      .values({
        adminId,
        abstractId,
      })
      .onConflictDoNothing(); // Prevents crashing if already assigned

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to assign abstract" };
  }
}

export async function updateAbstractStatus(abstractId: string, newStatus: string) {
  if (!abstractId || !newStatus) return { error: "Missing data" };

  try {
    // Cast to the enum types mapped in your schema
    await db.update(abstracts)
      .set({ status: newStatus as "Submitted" | "Under Review" | "Revision Required" | "Accepted" | "Rejected" })
      .where(eq(abstracts.id, abstractId));

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update status" };
  }
}