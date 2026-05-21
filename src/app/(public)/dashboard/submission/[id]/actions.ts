'use server';

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { iopPublications, slideSubmissions } from "@/db/schema";

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

export async function submitPresentationSlides(abstractId: string, fileUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.insert(slideSubmissions)
      .values({ abstractId, fileUrl, status: 'Under Review' })
      .onConflictDoUpdate({
        target: slideSubmissions.abstractId,
        set: { fileUrl, status: 'Under Review', updatedAt: new Date() }
      });

    revalidatePath(`/dashboard/submission/${abstractId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit slides. Please try again." };
  }
}

export async function cancelSlideSubmission(abstractId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.delete(slideSubmissions).where(eq(slideSubmissions.abstractId, abstractId));
    revalidatePath(`/dashboard/submission/${abstractId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete slides." };
  }
}