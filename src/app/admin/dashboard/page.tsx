import { db } from "@/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const allAbstracts = await db.query.abstracts.findMany({
    with: {
      author: { columns: { name: true, email: true, affiliation: true } },
      comments: {
        with: { admin: { columns: { username: true } } },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
      reviews: {
        with: { admin: { columns: { username: true } } },
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      },
      coauthors: { with: { user: { columns: { name: true } } } },
    },
    orderBy: (abstracts, { desc }) => [desc(abstracts.createdAt)],
  });

  const stats = {
    total: allAbstracts.length,
    underReview: allAbstracts.filter(a => a.status === 'Under Review').length,
    accepted: allAbstracts.filter(a => a.status === 'Accepted').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                Portal <span className="text-blue-600">Review</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Reviewing as <span className="text-slate-900 underline decoration-blue-200 underline-offset-4">{session.user.name}</span>
              </p>
            </div>

            {/* Modern Stats Cards */}
            <div className="flex gap-3">
              {[
                { label: 'Total', value: stats.total, color: 'text-slate-600', bg: 'bg-slate-100' },
                { label: 'Review', value: stats.underReview, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Accepted', value: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-50' }
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} px-6 py-4 rounded-2xl min-w-30 transition-transform hover:scale-105 cursor-default`}>
                  <p className={`text-[11px] uppercase font-black tracking-widest mb-1 opacity-70 ${stat.color}`}>{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="relative">
          <AdminDashboardClient initialData={allAbstracts as any} />
        </div>
      </div>
    </div>
  );
}