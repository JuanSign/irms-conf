"use server";

import { db } from "@/db";
import { abstracts, abstractComments, abstractReviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export type AbstractStatus = 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';

export async function updateAbstractStatus(abstractId: string, status: AbstractStatus) {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Unauthorized");

  await db.update(abstracts)
    .set({ status, updatedAt: new Date() })
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

export async function addAdminReviewFile(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Unauthorized");

  const abstractId = formData.get("abstractId") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const fileName = formData.get("fileName") as string;

  if (!abstractId || !fileUrl) throw new Error("Missing file data");

  await db.insert(abstractReviews).values({
    abstractId,
    adminId: session.user.id,
    filePath: fileUrl,
    fileName: fileName || "Review_Document.pdf",
  });

  await db.update(abstracts)
    .set({ updatedAt: new Date() })
    .where(eq(abstracts.id, abstractId));

  revalidatePath("/admin/dashboard");
}