import { Outlet, useLocation } from "react-router-dom";
import { BarChart2, PlusCircle, Layers, Home } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

const breadcrumbMap = {
  "/company": "Overview",
  "/company/post-job": "Post a Job",
  "/company/manage-jobs": "Manage Jobs",
};

export default function CompanyLayout() {
  const location = useLocation();
  const crumb = breadcrumbMap[location.pathname] ?? "Company";

  const links = [
    { to: "/company", label: "Overview", icon: BarChart2, exact: true },
    { to: "/company/post-job", label: "Post a Job", icon: PlusCircle },
    { to: "/company/manage-jobs", label: "Manage Jobs", icon: Layers },
  ];

  return (
    <div className="app-layout">
      <Sidebar title="Employment" roleLabel="Employer" links={links} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="app-header">
          <div className="flex items-center gap-2 text-sm">
            <Home size={16} className="text-slate-400" />
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">{crumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center font-semibold text-violet-600 text-sm">
              CP
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
