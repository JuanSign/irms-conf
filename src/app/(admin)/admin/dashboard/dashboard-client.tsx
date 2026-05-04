"use client";

import { useState, useMemo } from "react";
import { createAdmin, assignAbstract } from "./actions";

type Abstract = { id: string; title: string; status: string };
type User = { id: string; name: string; email: string; abstracts: Abstract[] };
type Admin = { id: string; name: string; username: string; role: string; assignments: { abstract: Abstract }[] };

// --- Reusable Searchable Select Component ---
function SearchableSelect({
  options,
  placeholder,
  label,
  name
}: {
  options: { id: string, label: string }[],
  placeholder: string,
  label: string,
  name: string
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string, label: string } | null>(null);

  const filtered = useMemo(() => {
    return query === ""
      ? options
      : options.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, options]);

  return (
    <div className="relative flex-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="hidden"
        name={name}
        value={selected?.id || ""}
        required
      />
      <div className="relative mt-1">
        <input
          type="text"
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
        />
        {isOpen && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results found.</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.id}
                  className="relative cursor-pointer select-none px-4 py-2 hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    setSelected(opt);
                    setQuery("");
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {selected && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}

export default function DashboardClient({
  users,
  admins,
  allAbstracts,
}: {
  users: User[];
  admins: Admin[];
  allAbstracts: Abstract[];
}) {
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await createAdmin(formData);
    if (res?.error) setError(res.error);
    else (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  async function handleAssign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await assignAbstract(formData.get("adminId") as string, formData.get("abstractId") as string);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="flex space-x-4 border-b pb-2">
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 font-medium ${activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
          Users & Abstracts
        </button>
        <button onClick={() => setActiveTab("admins")} className={`px-4 py-2 font-medium ${activeTab === "admins" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
          Admins & Assignments
        </button>
      </div>

      {activeTab === "users" && (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Submitted Abstracts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.abstracts.length === 0 ? <span className="text-sm text-gray-400">No abstracts</span> : (
                      <ul className="list-disc pl-4 text-sm text-gray-700">
                        {user.abstracts.map((ab) => (
                          <li key={ab.id}>{ab.title} <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2">{ab.status}</span></li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "admins" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Assigned Abstracts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">@{admin.username}</div>
                        <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{admin.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        {admin.assignments.length === 0 ? <span className="text-sm text-gray-400">No assignments</span> : (
                          <ul className="list-disc pl-4 text-sm text-gray-700">
                            {admin.assignments.map((asgn) => <li key={asgn.abstract.id}>{asgn.abstract.title}</li>)}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Abstract to Reviewer</h3>
              <form onSubmit={handleAssign} className="flex gap-4 items-end">
                <SearchableSelect
                  label="Select Admin"
                  name="adminId"
                  placeholder="Search by name..."
                  options={admins.map(a => ({ id: a.id, label: `${a.name} (${a.role})` }))}
                />
                <SearchableSelect
                  label="Select Abstract"
                  name="abstractId"
                  placeholder="Search by title..."
                  options={allAbstracts.map(a => ({ id: a.id, label: a.title }))}
                />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 h-9.5">
                  Assign
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Admin</h3>
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" name="username" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="Reviewer">Reviewer</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}