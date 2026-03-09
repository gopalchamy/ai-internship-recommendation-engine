import { Users, Building2, BriefcaseBusiness, ShieldCheck } from "lucide-react";

function AdminDashboard() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Platform overview and system monitoring.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Users</p>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users size={18} className="text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-2">0</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Companies</p>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Building2 size={18} className="text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-2">0</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Jobs Posted</p>
            <div className="p-2 bg-amber-50 rounded-lg">
              <BriefcaseBusiness size={18} className="text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-2">0</p>
        </div>
      </div>

      {/* Monitoring Section */}
      <div className="glass-card p-6">
        <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-indigo-500" />
          System Activity Monitoring
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-slate-500 text-sm">
          The admin can monitor:
          <ul className="list-disc list-inside mt-3 space-y-1 text-slate-500">
            <li>User registrations</li>
            <li>Company job postings</li>
            <li>Application activity</li>
            <li>AI ranking performance</li>
            <li>System usage trends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
