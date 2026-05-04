import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { abstractAssignments, abstractComments, abstractReviews } from "@/db/schema";
import ReviewClient from "./review-client";

export const metadata = {
  title: "Reviewer Workspace | IRMS 2026",
};

export default async function ReviewPage() {
  const session = await auth();

  // 1. Security Check: Ensure they are an admin
  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  // 2. Fetch assignments specifically for this reviewer
  const assignments = await db.query.abstractAssignments.findMany({
    where: eq(abstractAssignments.adminId, session.user.id),
    with: {
      abstract: {
        // Explicitly include the ID now that we need it for status updates
        columns: {
          id: true,
          title: true,
          topic: true,
          status: true,
          fileName: true,
          path: true,
        },
        with: {
          // Fetch comments by this admin, sorted oldest to newest (like a chat)
          comments: {
            where: eq(abstractComments.adminId, session.user.id),
            orderBy: (comments, { asc }) => [asc(comments.createdAt)],
          },
          // Fetch annotated files by this admin, sorted newest to oldest
          reviews: {
            where: eq(abstractReviews.adminId, session.user.id),
            orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
          }
        }
      }
    },
    // Sort so pending reviews are at the top, then sort by assignment date
    orderBy: (assignments, { asc }) => [asc(assignments.isReviewed), asc(assignments.assignedAt)]
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Assigned Abstracts
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Welcome, <span className="font-semibold text-gray-700">{session.user.name}</span>. Open a workspace below to evaluate your assigned submissions.
            </p>
          </div>
        </div>

        {/* Pass the fully populated data to the interactive workspace */}
        <ReviewClient assignments={assignments} adminId={session.user.id} />

      </div>
    </div>
  );
}