import { auth } from "@/auth"; // Adjust path to where your auth.ts is exported
import { redirect } from "next/navigation";
import { db } from "@/db";
import DashboardClient from "./dashboard-client";

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
  const [users, admins, allAbstracts] = await Promise.all([
    // Get users and the abstracts they wrote
    db.query.users.findMany({
      columns: { id: true, name: true, email: true },
      with: {
        abstracts: { columns: { id: true, title: true, status: true } },
      },
    }),

    // Get admins and the abstracts assigned to them
    db.query.admins.findMany({
      columns: { id: true, name: true, username: true, role: true },
      with: {
        assignments: {
          with: {
            abstract: { columns: { id: true, title: true, status: true } },
          },
        },
      },
      orderBy: (admins, { desc }) => [desc(admins.createdAt)] // Newest admins first
    }),

    // Get all abstracts for the assignment dropdown
    db.query.abstracts.findMany({
      columns: { id: true, title: true, status: true }
    })
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {session.user.name}. Manage users, admins, and assignments.
            </p>
          </div>
          {/* Optional: Add a sign-out button here later */}
        </div>

        {/* Client Component injected with Server Data */}
        <DashboardClient
          users={users}
          admins={admins}
          allAbstracts={allAbstracts}
        />

      </div>
    </div>
  );
}