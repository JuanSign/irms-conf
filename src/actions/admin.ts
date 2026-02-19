"use server";

import { db } from "@/db";
import { abstracts, abstractComments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateAbstractStatus(abstractId: string, status: string) {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Unauthorized");

  await db.update(abstracts)
    .set({ status })
    .where(eq(abstracts.id, abstractId));

  revalidatePath("/admin/dashboard");
}

export async function addAdminComment(abstractId: string, content: string) {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Unauthorized");

  await db.insert(abstractComments).values({
    abstractId,
    adminId: session.user.id,
    content,
  });

  revalidatePath("/admin/dashboard");
}