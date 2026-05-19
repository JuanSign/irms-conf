'use server';

import { db } from "@/db";
import { eventRegistrations } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { RegistrationCategory } from "@/types/event";

export async function createEventRegistration(data: {
  category: RegistrationCategory;
  isMember: boolean;
  memberEmail: string;
  amount: number;
  attendingWorkshop: boolean;
  attendingRockersNight: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.insert(eventRegistrations).values({
      userId: session.user.id,
      category: data.category,
      isIrmsMember: data.isMember,
      irmsMemberId: data.isMember ? data.memberEmail : null,
      amount: data.amount,
      attendingWorkshop: data.attendingWorkshop,
      attendingRockersNight: data.attendingRockersNight,
      status: "Pending Payment",
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create registration." };
  }
}

export async function cancelEventRegistration() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.delete(eventRegistrations)
      .where(eq(eventRegistrations.userId, session.user.id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Cancellation error:", error);
    return { error: "Failed to cancel registration." };
  }
}

export async function confirmPaymentProof(fileUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.update(eventRegistrations)
      .set({
        paymentProofUrl: fileUrl,
        status: "Verification Pending",
      })
      .where(eq(eventRegistrations.userId, session.user.id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return { error: "Failed to update payment status." };
  }
}