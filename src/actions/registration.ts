'use server';

import { db } from "@/db";
import { eventRegistrations } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserRegistration() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== 'user') {
      return { success: false, error: "Unauthorized" };
    }

    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.userId, userId),
    });

    return { success: true, data: registration || null };
  } catch (error: any) {
    console.error("Error fetching registration:", error);
    return { success: false, error: "Failed to load registration data" };
  }
}

export async function createRegistration(data: {
  category: string,
  amount: number,
  isIrmsMember: boolean,
  irmsMemberId?: string
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== 'user') {
      return { success: false, error: "Unauthorized" };
    }

    const newReg = await db.insert(eventRegistrations).values({
      userId,
      category: data.category as "Industry/Practitioner" | "Academic" | "Student",
      amount: data.amount,
      status: "Pending Payment",
      isIrmsMember: data.isIrmsMember,
      irmsMemberId: data.isIrmsMember ? data.irmsMemberId : null,
    }).returning();

    return { success: true, data: newReg[0] };
  } catch (error: any) {
    console.error("Error creating registration:", error);
    return { success: false, error: "Failed to generate invoice. You might already have an active registration." };
  }
}
export async function cancelRegistration(registrationId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Unauthorized" };

    const deleted = await db.delete(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.id, registrationId),
          eq(eventRegistrations.userId, userId),
          or(
            eq(eventRegistrations.status, 'Pending Payment'),
            eq(eventRegistrations.status, 'Rejected')
          )
        )
      ).returning();

    if (deleted.length === 0) {
      return { success: false, error: "Cannot cancel this registration." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error canceling registration:", error);
    return { success: false, error: "Failed to cancel registration." };
  }
}

export async function uploadPaymentProof(registrationId: string, fileUrl: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return { success: false, error: "Unauthorized" };

    const updated = await db.update(eventRegistrations)
      .set({
        paymentProofUrl: fileUrl,
        status: "Verification Pending"
      })
      .where(
        eq(eventRegistrations.id, registrationId)
      )
      .returning();

    if (updated.length === 0) {
      return { success: false, error: "Registration not found or unauthorized." };
    }

    return { success: true, data: updated[0] };
  } catch (error: any) {
    console.error("Error updating payment proof:", error);
    return { success: false, error: "Failed to submit payment proof." };
  }
}