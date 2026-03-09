import { useState, useEffect } from "react";
import { getApplications } from "../../utils/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { FileText, Briefcase, CalendarDays, CircleCheck } from "lucide-react";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const allApps = getApplications();
      const userApps = allApps.filter((a) => a.userId === auth.currentUser.uid);
      setApplications(userApps);

      // load jobs and match titles/companies locally
      const q = query(collection(db, "jobs"), where("active", "!=", false));
      const snap = await getDocs(q);
      const allJobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(allJobs);
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Applied Jobs
          </h1>
          <p className="text-slate-500 mt-1">Your application history</p>
        </div>
        <div className="saas-badge badge-info">
          {applications.length} Applied
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-14 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Briefcase size={24} />
            </div>
            <p className="text-sm text-slate-500">
              You haven't applied to any jobs yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {job?.title || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {job?.company || "Unknown"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText size={14} className="text-indigo-500" />
                      <span className="truncate max-w-[170px]">
                        {app.resumeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <CalendarDays size={14} />
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </div>

                    <div className="saas-badge badge-success gap-1.5">
                      <CircleCheck size={11} />
                      Submitted
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
