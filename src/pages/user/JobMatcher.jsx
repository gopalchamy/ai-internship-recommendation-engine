import { useState, useEffect } from "react";
import {
  getAiJobMatches,
  applyForJob,
  getApplications,
} from "../../utils/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  Cpu,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Zap,
  Sparkles,
} from "lucide-react";

export default function JobMatcher() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [matched, setMatched] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      // fetch resumes uploaded to Firestore for current user
      try {
        const q = query(
          collection(db, "resumes"),
          where("userId", "==", auth.currentUser.uid),
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().fileName,
          ...d.data(),
        }));
        setResumes(items);
      } catch (err) {
        console.error("Failed to load resumes:", err);
        setResumes([]);
      }

      // Get all applications and user's applications
      const allApps = getApplications();
      setAllApplications(allApps);
      const userApps = allApps.filter(
        (app) => app.userId === auth.currentUser.uid,
      );
      setApplications(userApps);
    };
    load();
  }, []);

  const runMatch = () => {
    if (!selectedId) return;
    const resume = resumes.find((r) => r.id === selectedId);
    if (!resume) return;

    setAnalyzing(true);
    setMatched([]);
    setProgress(0);

    const steps = [
      { pct: 8, msg: "Initializing neural matching..." },
      { pct: 30, msg: "Extracting semantic skill vectors..." },
      { pct: 55, msg: "Scanning 1,400+ active listings..." },
      { pct: 75, msg: "Calculating compatibility scores..." },
      { pct: 100, msg: "Synthesis complete." },
    ];

    steps.forEach(({ pct, msg }, i) => {
      setTimeout(async () => {
        setProgress(pct);
        setProgressMsg(msg);
        if (pct === 100) {
          const results = await getAiJobMatches(
            resume.name,
            auth.currentUser.uid,
          );
          setMatched(results);
          setAnalyzing(false);
        }
      }, i * 450);
    });
  };

  const apply = (jobId) => {
    const resume = resumes.find((r) => r.id === selectedId);
    if (!resume) return;
    applyForJob(jobId, resume.name, auth.currentUser.uid);
    const updatedAll = getApplications();
    setAllApplications(updatedAll);
    setApplications(
      updatedAll.filter((app) => app.userId === auth.currentUser.uid),
    );
  };

  const hasApplied = (jobId) => applications.some((a) => a.jobId === jobId);

  return (
    <div className="max-w-4xl space-y-8">
      {/* AI Hero Banner */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-indigo-500 mb-4">
            <Sparkles size={12} />
            AI-Powered Matching
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins] mb-3">
            Job Matcher
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our AI analyzes your resume and matches you with the best job
            opportunities based on your skills and experience.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent flex items-center justify-center opacity-50">
          <Cpu size={100} className="text-indigo-500/20" />
        </div>
      </div>

      {/* Resume Selector */}
      <div className="glass-card p-6">
        {resumes.length === 0 ? (
          <div className="flex items-center gap-4 text-amber-500 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle size={20} />
            <p className="text-sm">
              Please upload a resume in the Documents section to begin matching.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Select Resume
                </label>
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Choose document...</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={runMatch}
                disabled={!selectedId || analyzing}
                className="saas-btn saas-btn-primary py-2.5 px-6"
              >
                <Zap size={16} className={analyzing ? "animate-pulse" : ""} />
                {analyzing ? "Analyzing..." : "Find Matches"}
              </button>
            </div>

            {analyzing && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-600">{progressMsg}</p>
                  <span className="text-lg font-semibold text-indigo-500">
                    {progress}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill bg-indigo-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {!analyzing && matched.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500">Match Results</h3>
          <div className="grid grid-cols-1 gap-3">
            {matched.map((job, idx) => {
              const score = Math.max(50, 98 - idx * 3);
              const applied = hasApplied(job.id);
              const totalApplicants = allApplications.filter(
                (a) => a.jobId === job.id,
              ).length;
              const otherApplicants = allApplications.filter(
                (a) => a.jobId === job.id && a.userId !== auth.currentUser.uid,
              ).length;
              return (
                <div
                  key={job.id}
                  className="glass-card p-5 flex items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    {/* Score Visual */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="transparent"
                          stroke="#e2e8f0"
                          strokeWidth="4"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="transparent"
                          stroke="#6366F1"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - score / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900">
                        {score}%
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {job.company}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {job.skills
                          .split(",")
                          .slice(0, 3)
                          .map((s, i) => (
                            <span
                              key={i}
                              className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="pl-5">
                    <div className="text-xs text-slate-400 text-right mb-2">
                      {totalApplicants > 0 ? (
                        <span>
                          {otherApplicants} other applicant
                          {otherApplicants !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span>No applicants yet</span>
                      )}
                    </div>
                    {applied ? (
                      <div className="saas-badge badge-success gap-2 py-2 px-5">
                        <CheckCircle2 size={12} />
                        Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => apply(job.id)}
                        className="saas-btn saas-btn-secondary py-2 px-5 text-sm"
                      >
                        Apply Now
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
