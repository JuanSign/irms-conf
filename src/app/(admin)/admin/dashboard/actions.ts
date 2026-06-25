"use server";

import { db } from "@/db";
import { admins, abstractAssignments, abstracts, eventRegistrations, iopPublications, slideSubmissions } from "@/db/schema";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "Super Admin" | "Reviewer";

  if (!name || !username || !password || !role) return { error: "All fields are required" };

  try {
    const passwordHash = await hash(password, 10);
    await db.insert(admins).values({ name, username, passwordHash, role });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') return { error: "Username already exists" };
    return { error: "Failed to create admin" };
  }
}

export async function assignAbstract(adminId: string, abstractId: string) {
  if (!adminId || !abstractId) return { error: "Missing admin or abstract ID" };
  try {
    await db.insert(abstractAssignments).values({ adminId, abstractId }).onConflictDoNothing();
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to assign abstract" }; }
}

export async function updateAbstractStatus(abstractId: string, newStatus: string) {
  try {
    await db.update(abstracts).set({ status: newStatus as any }).where(eq(abstracts.id, abstractId));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to update abstract status" }; }
}

export async function updateRegistrationStatus(id: string, newStatus: string) {
  try {
    await db.update(eventRegistrations).set({ status: newStatus as any }).where(eq(eventRegistrations.id, id));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to update registration status" }; }
}

export async function updateIopStatus(id: string, newStatus: string) {
  try {
    await db.update(iopPublications).set({ status: newStatus as any }).where(eq(iopPublications.id, id));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to update IOP payment status" }; }
}

export async function updateIopPaperStatus(id: string, newStatus: string) {
  try {
    await db.update(iopPublications).set({ paperStatus: newStatus as any }).where(eq(iopPublications.id, id));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to update IOP paper status" }; }
}

export async function updateSlideStatus(id: string, newStatus: string) {
  try {
    await db.update(slideSubmissions).set({ status: newStatus as any }).where(eq(slideSubmissions.id, id));
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) { return { error: "Failed to update slide status" }; }
}