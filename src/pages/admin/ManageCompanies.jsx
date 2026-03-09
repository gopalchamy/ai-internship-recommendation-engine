import { useState } from "react";
import { Search, Building, MoreHorizontal, ExternalLink } from "lucide-react";

export default function ManageCompanies() {
  const [companies] = useState([
    {
      id: 1,
      name: "TechCorp",
      industry: "Software",
      jobs: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "DataSync",
      industry: "Data Analytics",
      jobs: 5,
      status: "Active",
    },
    {
      id: 3,
      name: "CloudNet",
      industry: "Cloud Infrastructure",
      jobs: 8,
      status: "Active",
    },
    {
      id: 4,
      name: "DesignPro",
      industry: "Design & UX",
      jobs: 3,
      status: "Pending Review",
    },
    {
      id: 5,
      name: "FinTech Innovations",
      industry: "Finance",
      jobs: 0,
      status: "Active",
    },
  ]);

  const [search, setSearch] = useState("");
  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Manage Companies
          </h1>
          <p className="text-slate-500 mt-1">
            Verify and monitor employer accounts.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-3">
        <div className="pl-3 text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by company name or industry..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Active Jobs</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((co) => (
              <tr key={co.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-medium text-sm">
                      {co.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{co.name}</p>
                      <p className="text-xs text-slate-400">
                        ID: #ORD-{co.id}932
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-slate-500 bg-slate-50 px-2.5 py-1 rounded">
                    {co.industry}
                  </span>
                </td>
                <td>
                  <span
                    className={`font-medium ${co.jobs > 0 ? "text-indigo-500" : "text-slate-300"}`}
                  >
                    {co.jobs} listings
                  </span>
                </td>
                <td>
                  {co.status === "Active" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-sm text-emerald-500">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-sm text-amber-500">Pending</span>
                    </div>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                    <button className="saas-btn saas-btn-secondary py-1.5 px-3 text-sm">
                      Audit <ExternalLink size={12} />
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
