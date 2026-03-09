import { Outlet, useLocation } from "react-router-dom";
import { FileText, Search, Cpu, Home, Briefcase } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

const breadcrumbMap = {
  "/user": "Resumes",
  "/user/jobs": "Jobs",
  "/user/matcher": "Matcher",
};

export default function UserLayout() {
  const location = useLocation();
  const crumb = breadcrumbMap[location.pathname] ?? "Candidate";

  const links = [
    { to: "/user", label: "My Resumes", icon: FileText, exact: true },
    { to: "/user/jobs", label: "Browse Jobs", icon: Search },
    { to: "/user/matcher", label: "AI Matcher", icon: Cpu },
    { to: "/user/applied", label: "Applied Jobs", icon: Briefcase },
  ];

  return (
    <div className="app-layout">
      <Sidebar title="Candidate" roleLabel="Candidate" links={links} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="app-header">
          <div className="flex items-center gap-2 text-sm">
            <Home size={16} className="text-slate-400" />
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">{crumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-semibold text-indigo-600 text-sm">
              JD
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
