import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import DashboardClient, { User, Admin, AbstractDetail } from "./dashboard-client";

export const metadata = {
  title: "Super Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // 1. Security Check: Kick out anyone who isn't a Super Admin
  if (!session || session.user.role !== "admin" || session.user.adminRole !== "Super Admin") {
    redirect("/admin");
  }

  // 2. Fetch Data using Drizzle Relational Queries
  const [rawUsers, rawAdmins, rawAbstracts] = await Promise.all([
    // Get users, their authored abstracts, AND co-authored abstracts
    db.query.users.findMany({
      columns: { id: true, name: true, email: true, affiliation: true },
      with: {
        abstracts: { columns: { id: true, title: true, status: true } },
        coauthoredAbstracts: {
          with: {
            abstract: { columns: { id: true, title: true, status: true } }
          }
        }
      },
    }),

    // Get admins and their assignments
    db.query.admins.findMany({
      columns: { id: true, name: true, username: true, role: true },
      with: {
        assignments: {
          with: {
            abstract: { columns: { id: true, title: true, status: true } },
          },
        },
      },
      orderBy: (admins, { desc }) => [desc(admins.createdAt)]
    }),

    // Get ALL abstracts with author info, file paths, and detailed review assignments
    db.query.abstracts.findMany({
      with: {
        author: { columns: { name: true, email: true } },
        assignments: {
          with: {
            admin: { columns: { name: true } }
          }
        }
      },
      orderBy: (abstracts, { desc }) => [desc(abstracts.createdAt)]
    })
  ]);

  // 3. Map Data to Strictly Match Client Types (Removes extra DB fields like createdAt, passwordHash, etc.)
  const users: User[] = rawUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    affiliation: u.affiliation,
    abstracts: u.abstracts,
    coauthoredAbstracts: u.coauthoredAbstracts
  }));

  const admins: Admin[] = rawAdmins.map(a => ({
    id: a.id,
    name: a.name,
    username: a.username,
    role: a.role,
    assignments: a.assignments.map(asgn => ({
      isReviewed: asgn.isReviewed,
      abstract: asgn.abstract
    }))
  }));

  const abstracts: AbstractDetail[] = rawAbstracts.map(ab => ({
    id: ab.id,
    title: ab.title,
    status: ab.status,
    path: ab.path,
    fileName: ab.fileName,
    author: ab.author,
    assignments: ab.assignments.map(asgn => ({
      isReviewed: asgn.isReviewed,
      scoreClarity: asgn.scoreClarity,
      scoreQuality: asgn.scoreQuality,
      scoreCompleteness: asgn.scoreCompleteness,
      scoreInteresting: asgn.scoreInteresting,
      admin: asgn.admin
    }))
  }));

  // 4. Calculate Stats Server-Side
  const allAssignments = admins.flatMap(a => a.assignments);
  const stats = {
    totalUsers: users.length,
    totalAbstracts: abstracts.length,
    totalAdmins: admins.length,
    statusBreakdown: {
      submitted: abstracts.filter(a => a.status === 'Submitted').length,
      underReview: abstracts.filter(a => a.status === 'Under Review').length,
      revision: abstracts.filter(a => a.status === 'Revision Required').length,
      accepted: abstracts.filter(a => a.status === 'Accepted').length,
      rejected: abstracts.filter(a => a.status === 'Rejected').length,
    },
    reviews: {
      completed: allAssignments.filter(a => a.isReviewed).length,
      total: allAssignments.length,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {session.user.name}. Overview of conference submissions and reviews.
            </p>
          </div>
        </div>

        {/* 100% Type-Safe Client Component */}
        <DashboardClient
          users={users}
          admins={admins}
          abstracts={abstracts}
          stats={stats}
        />

      </div>
    </div>
  );
}