import { useState, useEffect } from "react";

import {
  Upload,
  FileText,
  Trash2,
  FilePlus,
  CheckCircle2,
  Info,
  Briefcase,
} from "lucide-react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getApplications } from "../../utils/storage";
const STEPS = ["Upload", "Processing", "Verified", "Matched"];

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // load resumes from Firestore when component mounts
    fetchResumes();
    loadAppliedJobs();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const base64 = await convertToBase64(file);

      await addDoc(collection(db, "resumes"), {
        userId: auth.currentUser.uid,
        fileName: file.name,
        base64Data: base64,
        uploadedAt: serverTimestamp(),
      });
    }

    fetchResumes();
  };
  const fetchResumes = async () => {
    const q = query(
      collection(db, "resumes"),
      where("userId", "==", auth.currentUser.uid),
    );

    const snapshot = await getDocs(q);
    setResumes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const loadAppliedJobs = async () => {
    // Get all jobs
    const jobsQuery = query(
      collection(db, "jobs"),
      where("active", "!=", false),
    );
    const jobsSnap = await getDocs(jobsQuery);
    const allJobs = jobsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setJobs(allJobs);

    // Get user's applications
    const allApps = getApplications();
    const userApps = allApps.filter(
      (app) => app.userId === auth.currentUser.uid,
    );
    setAppliedJobs(userApps);
  };

  const handleRemove = async (id) => {
    // remove document from Firestore then refresh list
    await deleteDoc(doc(db, "resumes", id));
    await fetchResumes();
  };

  const viewResume = async (resume) => {
    try {
      if (!resume || !resume.base64Data) return;
      // base64Data is a data URL (e.g. data:application/pdf;base64,....)
      const resp = await fetch(resume.base64Data);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to open resume:", err);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            My Resumes
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your documents for AI-powered matching.
          </p>
        </div>
        <label className="saas-btn saas-btn-primary">
          <Upload size={16} />
          Upload Resume
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Step Flow */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-8 last:grow-0 grow">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all ${
                    i < activeStep
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : i === activeStep
                        ? "border-indigo-500 text-indigo-500"
                        : "border-slate-200 text-slate-400"
                  }`}
                >
                  {i < activeStep ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    i <= activeStep ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-[1px] grow transition-colors ${i < activeStep ? "bg-emerald-500" : "bg-slate-100"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <label className="group block h-56 cursor-pointer">
            <div className="h-full rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <FilePlus size={24} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-900">
                Drop document
              </p>
              <p className="mt-1 text-xs text-slate-400">PDF or DOCX allowed</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Document List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-medium text-slate-500">Your Documents</h3>
          {resumes.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <Info size={24} />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                No documents uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className="glass-card p-4 flex items-center justify-between group hover:border-slate-300 transition-colors"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => viewResume(r)}
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {r.fileName || r.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Uploaded on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(r.id)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
