import { useState } from "react";
import { FileText, UploadCloud, Briefcase, ArrowRight } from "lucide-react";

function UserDashboard() {
  const [resumes, setResumes] = useState([]);

  const uploadResume = (e) => {
    const files = Array.from(e.target.files);
    setResumes([...resumes, ...files]);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Manage your job search.
        </p>
      </div>

      {/* Upload Section */}
      <div className="glass-card p-6">
        <h3 className="font-medium text-slate-900 mb-4">Upload Resumes</h3>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
          <UploadCloud size={20} className="text-indigo-500 mb-2" />
          <span className="text-slate-500 text-sm">
            Click to upload or drag & drop resumes
          </span>
          <input
            type="file"
            multiple
            onChange={uploadResume}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Resumes Section */}
      <div className="glass-card p-6">
        <h3 className="font-medium text-slate-900 mb-4">Uploaded Resumes</h3>

        {resumes.length === 0 ? (
          <p className="text-slate-500 text-sm">No resumes uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {resumes.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200"
              >
                <span className="text-slate-600 flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-indigo-500" />
                  {file.name}
                </span>
                <button className="text-red-500 hover:text-red-400 text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Section */}
      <div className="glass-card p-6">
        <h3 className="font-medium text-slate-900 mb-4">Available Jobs</h3>
        <button className="saas-btn saas-btn-primary">
          <Briefcase size={16} /> Search Jobs <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
