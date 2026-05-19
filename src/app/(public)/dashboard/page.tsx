import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import EventWidget from "@/components/dashboard/event/EventWidget";
import DocumentWidget from "@/components/dashboard/document/DocumentWidget";
import { AbstractSubmission } from "@/types/submission";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "user") {
    redirect("/dashboard/register");
  }

  const userData = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      registration: true,
      abstracts: {
        with: { comments: true, coauthors: true },
      },
      coauthoredAbstracts: {
        with: {
          abstract: {
            with: { comments: true, coauthors: true }
          }
        }
      }
    },
  });

  if (!userData) {
    redirect("/dashboard/register");
  }

  const primaryAbstracts = userData.abstracts || [];
  const coAuthoredAbstracts = userData.coauthoredAbstracts?.map(ca => ca.abstract) || [];

  const allAbstracts = [...primaryAbstracts, ...coAuthoredAbstracts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasAbstracts = allAbstracts.length > 0;

  return (
    <div className="min-h-screen bg-irms-light pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {hasAbstracts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <EventWidget registration={userData.registration} />
            <DocumentWidget
              abstracts={allAbstracts as unknown as AbstractSubmission[]}
              currentUserId={session.user.id}
            />
          </div>
        ) : (
          <EventWidget registration={userData.registration} />
        )}
      </div>
    </div>
  );
}