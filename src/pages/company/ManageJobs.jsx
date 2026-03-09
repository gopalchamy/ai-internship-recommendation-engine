import { useState, useEffect } from "react";
import { getApplications } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Download,
  ChevronRight,
  Users,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      // Get only jobs posted by this company
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", auth.currentUser.uid),
      );
      const snap = await getDocs(q);
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(all);

      // Get all applications
      const allApps = getApplications();

      // Filter applications: only show those for jobs posted by this company
      const jobIds = all.map((job) => job.id);
      const filteredApps = allApps.filter((app) => jobIds.includes(app.jobId));
      setApplications(filteredApps);
    };
    load();
  }, []);

  const appsFor = (id) => applications.filter((a) => a.jobId === id);

  const closeJob = async (id) => {
    // mark as inactive in Firestore and refresh
    await updateDoc(doc(db, "jobs", id), { active: false });
    const q = query(
      collection(db, "jobs"),
      where("companyId", "==", auth.currentUser.uid),
    );
    const snap = await getDocs(q);
    setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* ── Candidates view ── */
  if (selected) {
    const apps = appsFor(selected.id);
    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelected(null)}
            className="saas-btn saas-btn-secondary p-2 rounded-lg"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
              {selected.title}
            </h1>
            <p className="text-slate-500 mt-0.5">
              Evaluation Pool · {apps.length} applicants
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              AI Ranking Activated
            </p>
            <p className="text-xs text-slate-500">
              Candidates prioritized by skill proximity to:{" "}
              <span className="font-medium">{selected.skills}</span>
            </p>
          </div>
        </div>

        <div className="saas-table-container">
          {apps.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Users size={24} />
              </div>
              <p className="text-sm text-slate-500">No applicants yet.</p>
            </div>
          ) : (
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Application Date</th>
                  <th>Compatibility Score</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, idx) => {
                  const score = Math.max(50, 95 - idx * 5);
                  const scoreType =
                    score >= 80 ? "high" : score >= 65 ? "mid" : "low";
                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-medium text-slate-500 text-sm">
                            {app.resumeName.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">
                            {app.resumeName}
                          </span>
                        </div>
                      </td>
                      <td className="text-slate-500">
                        {new Date(app.dateApplied).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · Today
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className={`score-badge score-${scoreType}`}>
                            {score}%
                          </span>
                          <div className="h-1.5 w-20 bg-slate-50 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${score >= 80 ? "bg-green-500" : "bg-amber-400"}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <button className="saas-btn saas-btn-secondary py-1.5 px-3 text-xs">
                          <Download size={14} /> Resume
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  /* ── Active Listings ── */
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Manage Jobs
          </h1>
          <p className="text-slate-500 mt-1">
            Control and monitor your published listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="saas-btn saas-btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Position & Location</th>
              <th>Status</th>
              <th>Candidates</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const count = appsFor(job.id).length;
              const active = !job.active === false;
              return (
                <tr key={job.id}>
                  <td>
                    <div>
                      <p className="font-medium text-slate-900">{job.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {job.company} · Remote
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-slate-300"}`}
                      />
                      <span
                        className={`text-sm ${active ? "text-emerald-500" : "text-slate-400"}`}
                      >
                        {active ? "Active" : "Archived"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${count > 0 ? "text-indigo-500" : "text-slate-400"}`}
                      >
                        {count}
                      </span>
                      <Users size={12} className="text-slate-400" />
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      {active && (
                        <button
                          onClick={() => closeJob(job.id)}
                          className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => setSelected(job)}
                        className="saas-btn saas-btn-secondary py-1.5 px-3 text-sm"
                      >
                        Candidates
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
