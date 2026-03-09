import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Calendar,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      // fetch all active jobs
      const q = query(collection(db, "jobs"), where("active", "!=", false));
      const snap = await getDocs(q);
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Job Listings
          </h1>
          <p className="text-slate-500 mt-1">
            {jobs.length} opportunities available
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-3 min-w-[300px]">
          <div className="pl-2 text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Job Listings */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Search size={24} />
          </div>
          <p className="text-sm text-slate-500">
            No matching opportunities found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="glass-card p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-5">
                {/* Company Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-semibold text-lg">
                  {job.company.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-medium text-slate-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Building2 size={14} />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={14} />
                          Remote
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="saas-badge badge-success">New</span>
                      <button className="saas-btn saas-btn-primary py-2 px-4 text-sm">
                        Apply
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills.split(",").map((s, i) => (
                      <span
                        key={i}
                        className="text-xs text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                      >
                        <Sparkles size={10} />
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Closing{" "}
                      {new Date(job.deadline).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-indigo-500 font-medium">
                      AI Matching Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
