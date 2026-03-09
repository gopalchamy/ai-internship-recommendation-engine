import {
  BriefcaseBusiness,
  Users,
  CalendarClock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

function CompanyDashboard() {
  const kpis = [
    {
      label: "Active Openings",
      value: "12",
      icon: BriefcaseBusiness,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      label: "Applicants",
      value: "148",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg. Review Time",
      value: "18h",
      icon: CalendarClock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Company Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            AI-assisted screening and fast publishing.
          </p>
        </div>
        <button className="saas-btn saas-btn-secondary">
          Export Report <ArrowUpRight size={15} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {item.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${item.bg}`}>
                  <Icon size={20} className={item.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Job & Applicants */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-card p-6 xl:col-span-2">
          <div className="mb-6">
            <h3 className="font-medium text-slate-900">Post New Job</h3>
            <p className="text-sm text-slate-500 mt-1">
              Create a listing and let AI rank candidates automatically.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Data Analyst"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Skills Required
              </label>
              <input
                type="text"
                placeholder="React, SQL, Communication"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Application Deadline
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
              />
            </div>

            <button className="saas-btn saas-btn-primary w-full py-2.5 justify-center">
              Publish Listing
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-medium text-slate-900 mb-4">AI Assistant</h3>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  AI Ranking Pipeline
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  After deadline, top candidates are ranked by skills and match
                  score.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-slate-50 text-sm text-slate-500">
            Tip: Include specific skills in the job description to improve
            candidate quality.
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
