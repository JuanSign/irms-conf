'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { iopPublications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createIopApplication(abstractId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.insert(iopPublications).values({ abstractId });
    revalidatePath(`/dashboard/submission/${abstractId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create application. Please try again." };
  }
}

export async function confirmIopPaymentProof(abstractId: string, fileUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.update(iopPublications)
      .set({ paymentProofUrl: fileUrl, status: 'Verification Pending' })
      .where(eq(iopPublications.abstractId, abstractId));

    revalidatePath(`/dashboard/submission/${abstractId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to confirm payment proof." };
  }
}

export async function cancelIopApplication(abstractId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.delete(iopPublications).where(eq(iopPublications.abstractId, abstractId));
    revalidatePath(`/dashboard/submission/${abstractId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to cancel application." };
  }
}