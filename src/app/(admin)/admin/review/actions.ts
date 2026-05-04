"use server";

import { db } from "@/db";
import { abstractAssignments, abstractComments, abstractReviews, abstracts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadAnnotationToR2 } from "@/actions/files";

// 1. SAVE SCORES
export async function saveScores(formData: FormData) {
  const abstractId = formData.get("abstractId") as string;
  const adminId = formData.get("adminId") as string;

  const scoreClarity = parseInt(formData.get("scoreClarity") as string);
  const scoreQuality = parseInt(formData.get("scoreQuality") as string);
  const scoreCompleteness = parseInt(formData.get("scoreCompleteness") as string);
  const scoreInteresting = parseInt(formData.get("scoreInteresting") as string);

  try {
    await db.update(abstractAssignments)
      .set({
        scoreClarity,
        scoreQuality,
        scoreCompleteness,
        scoreInteresting,
        isReviewed: true, // Mark as reviewed once scores are locked in
      })
      .where(
        and(
          eq(abstractAssignments.abstractId, abstractId),
          eq(abstractAssignments.adminId, adminId)
        )
      );

    revalidatePath("/admin/review");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save scores." };
  }
}

// 2. ADD A COMMENT
export async function addComment(formData: FormData) {
  const abstractId = formData.get("abstractId") as string;
  const adminId = formData.get("adminId") as string;
  const content = formData.get("content") as string;

  if (!content || content.trim() === "") return { error: "Comment cannot be empty." };

  try {
    await db.insert(abstractComments).values({
      abstractId,
      adminId,
      content: content.trim(),
    });

    revalidatePath("/admin/review");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add comment." };
  }
}

// 3. UPLOAD ANNOTATED FILE
export async function uploadAnnotation(formData: FormData) {
  const abstractId = formData.get("abstractId") as string;
  const adminId = formData.get("adminId") as string;
  const file = formData.get("annotatedFile") as File | null;

  if (!file || file.size === 0) return { error: "No file selected." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadAnnotationToR2(buffer, file.name, file.type);

    if (uploadResult.error) throw new Error(uploadResult.error);

    await db.insert(abstractReviews).values({
      abstractId,
      adminId,
      fileName: file.name,
      filePath: uploadResult.fileUrl!,
    });

    revalidatePath("/admin/review");
    return { success: true };
  } catch (error) {
    return { error: "Failed to upload file." };
  }
}

// 4. UPDATE ABSTRACT STATUS
export async function updateStatus(formData: FormData) {
  const abstractId = formData.get("abstractId") as string;
  // Typecast to your specific Enum values
  const status = formData.get("status") as 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';

  try {
    await db.update(abstracts)
      .set({ status })
      .where(eq(abstracts.id, abstractId));

    revalidatePath("/admin/review");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status." };
  }
}