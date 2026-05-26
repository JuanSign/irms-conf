import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import DashboardClient from "./dashboard-client";
import { UserDetail, AdminDetail, AbstractDetail, EventRegistrationDetail, IopDetail, SlideDetail, DashboardStats } from "./types";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin" || session.user.adminRole !== "Super Admin") {
    redirect("/admin");
  }

  const [rawUsers, rawAdmins, rawAbstracts, rawRegistrations] = await Promise.all([
    db.query.users.findMany({
      columns: { id: true, name: true, email: true, affiliation: true },
      with: {
        abstracts: { columns: { id: true, title: true, status: true } },
        coauthoredAbstracts: { with: { abstract: { columns: { id: true, title: true, status: true } } } }
      },
    }),
    db.query.admins.findMany({
      columns: { id: true, name: true, username: true, role: true },
      with: { assignments: { with: { abstract: { columns: { id: true, title: true, status: true } } } } },
      orderBy: (a, { desc }) => [desc(a.createdAt)]
    }),
    db.query.abstracts.findMany({
      with: {
        author: { columns: { name: true, email: true } },
        assignments: { with: { admin: { columns: { name: true } } } },
        iopPublication: true,
        slideSubmission: true
      },
      orderBy: (a, { desc }) => [desc(a.createdAt)]
    }),
    db.query.eventRegistrations.findMany({
      with: { user: { columns: { name: true, email: true, affiliation: true } } },
      orderBy: (r, { desc }) => [desc(r.createdAt)]
    })
  ]);

  const users: UserDetail[] = rawUsers;
  const admins: AdminDetail[] = rawAdmins;

  const abstracts: AbstractDetail[] = rawAbstracts.map(ab => ({
    id: ab.id, title: ab.title, status: ab.status, path: ab.path, fileName: ab.fileName,
    author: ab.author, assignments: ab.assignments
  }));

  const registrations: EventRegistrationDetail[] = rawRegistrations.map(r => ({
    id: r.id, category: r.category, amount: r.amount, paymentProofUrl: r.paymentProofUrl,
    status: r.status, isIrmsMember: r.isIrmsMember, irmsMemberId: r.irmsMemberId,
    user: r.user, createdAt: r.createdAt
  }));

  const iopPublications: IopDetail[] = rawAbstracts
    .filter(ab => ab.iopPublication)
    .map(ab => ({
      ...ab.iopPublication!,
      abstract: { id: ab.id, title: ab.title, author: ab.author }
    }));

  const slides: SlideDetail[] = rawAbstracts
    .filter(ab => ab.slideSubmission)
    .map(ab => ({
      ...ab.slideSubmission!,
      abstract: { id: ab.id, title: ab.title, author: ab.author }
    }));

  const allAssignments = admins.flatMap(a => a.assignments);
  const verifiedRevenue = registrations.filter(r => r.status === 'Verified').reduce((acc, curr) => acc + curr.amount, 0);

  const stats: DashboardStats = {
    totalUsers: users.length, totalAbstracts: abstracts.length, totalRegistrations: registrations.length,
    verifiedRevenue,
    statusBreakdown: {
      accepted: abstracts.filter(a => a.status === 'Accepted').length,
      rejected: abstracts.filter(a => a.status === 'Rejected').length,
    },
    reviews: { completed: allAssignments.filter(a => a.isReviewed).length, total: allAssignments.length }
  };

  return (
    <DashboardClient
      userName={session.user.name || "Admin"}
      users={users} admins={admins} abstracts={abstracts}
      registrations={registrations} iopPublications={iopPublications} slides={slides} stats={stats}
    />
  );
}