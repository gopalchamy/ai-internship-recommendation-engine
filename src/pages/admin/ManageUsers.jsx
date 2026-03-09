import { useState } from "react";
import { Search, Shield, MoreVertical } from "lucide-react";

export default function ManageUsers() {
  const [users] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      applications: 4,
      joinDate: "2026-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      applications: 2,
      joinDate: "2026-02-02",
      status: "Active",
    },
    {
      id: 3,
      name: "Charlie Davis",
      email: "charlie@example.com",
      applications: 7,
      joinDate: "2025-11-20",
      status: "Active",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      applications: 1,
      joinDate: "2026-03-01",
      status: "Active",
    },
    {
      id: 5,
      name: "Evan Wright",
      email: "evan@example.com",
      applications: 0,
      joinDate: "2026-03-10",
      status: "Suspended",
    },
  ]);

  const [search, setSearch] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Manage Users
          </h1>
          <p className="text-slate-500 mt-1">
            Manage registered candidates and their access.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-3">
        <div className="pl-3 text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="pr-4">
          <span className="text-xs text-slate-400">
            {filtered.length} results
          </span>
        </div>
      </div>

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Applications</th>
              <th>Joined</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center font-medium text-slate-500 text-sm">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`font-medium ${u.applications > 0 ? "text-indigo-500" : "text-slate-300"}`}
                  >
                    {u.applications} files
                  </span>
                </td>
                <td className="text-slate-500 text-sm">
                  {new Date(u.joinDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span
                      className={`text-sm ${u.status === "Active" ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {u.status}
                    </span>
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="saas-btn saas-btn-secondary p-1.5 rounded-lg text-slate-400 hover:text-slate-900">
                      <Shield size={16} />
                    </button>
                    <button className="saas-btn saas-btn-secondary p-1.5 rounded-lg text-slate-400 hover:text-slate-900">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
