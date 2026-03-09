import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  Sparkles,
  Target,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Zap,
  Brain,
  CheckCircle2,
  Star,
} from "lucide-react";
import AnalysisResult from "../components/AnalysisResult";

export default function AILanding() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);
  const resultRef = useRef(null);

  const features = [
    {
      icon: BarChart3,
      title: "Resume Score",
      desc: "Get an instant AI-generated score based on industry standards and best practices.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Skill Gap Detection",
      desc: "Identify missing skills and get personalised recommendations to strengthen your profile.",
      color: "from-violet-500 to-pink-500",
    },
    {
      icon: ShieldCheck,
      title: "ATS Compatibility",
      desc: "Ensure your resume passes Applicant Tracking Systems used by top employers.",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (
      dropped &&
      (dropped.type === "application/pdf" || dropped.name.endsWith(".docx"))
    ) {
      setFile(dropped);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);

    // Simulated analysis
    setTimeout(() => {
      setResult({
        score: 82,
        strengths: [
          "Strong relevant work experience section",
          "Good use of action verbs and quantified achievements",
          "Clean and readable formatting",
          "Appropriate length for experience level",
        ],
        weaknesses: [
          "Missing a professional summary or objective statement",
          "Skills section could be more specific to the target role",
          "No links to portfolio or LinkedIn profile",
        ],
        suggestions: [
          "Add a 2–3 line professional summary highlighting your core value proposition",
          "Include keywords from the job description you're targeting",
          "Add measurable metrics to at least 3 more bullet points",
          "Include relevant certifications or courses",
          "Add a link to your LinkedIn profile and online portfolio",
        ],
        atsScore: 74,
        skillGaps: ["Cloud Computing", "CI/CD Pipelines", "System Design"],
      });
      setAnalyzing(false);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        200,
      );
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ─── Subtle Background Accents ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-violet-100/40 rounded-full blur-[80px]" />
      </div>

      {/* ─── Navbar ─── */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Brain size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 font-[Poppins]">
            AI Resume Analyzer
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="saas-btn saas-btn-primary text-sm py-2 px-5"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-600 mb-8">
          <Sparkles size={14} />
          <span>Powered by Advanced AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 font-[Poppins]">
          <span className="text-slate-900">AI Resume</span>
          <br />
          <span className="gradient-text">Analyzer</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
          Get instant AI-powered feedback on your resume. Discover your score,
          identify skill gaps, and ensure ATS compatibility — all in seconds.
        </p>

        {/* ─── Upload Zone ─── */}
        <div className="max-w-2xl mx-auto">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`upload-zone p-10 md:p-16 flex flex-col items-center justify-center text-center transition-all ${
              dragOver
                ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_60px_-12px_rgba(99,102,241,0.4)]"
                : ""
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-indigo-500" />
                </div>
                <p className="text-slate-900 font-medium text-lg">
                  {file.name}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {(file.size / 1024).toFixed(1)} KB · Ready to analyze
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 animate-float">
                  <Upload size={28} className="text-indigo-500" />
                </div>
                <p className="text-slate-900 font-medium text-lg">
                  Drop your resume here
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  PDF or DOCX · Drag & drop or click to browse
                </p>
              </>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className={`mt-8 w-full md:w-auto saas-btn text-base py-4 px-12 rounded-2xl font-semibold transition-all ${
              file && !analyzing
                ? "saas-btn-primary shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            {analyzing ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    className="opacity-75"
                  />
                </svg>
                Analyzing Resume...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap size={18} />
                Analyze Resume
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <p className="text-indigo-500 text-sm font-semibold uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Poppins]">
            Everything you need to
            <span className="gradient-text"> stand out</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-card p-8 group">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 font-[Poppins]">
                  {f.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <p className="text-violet-500 text-sm font-semibold uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Poppins]">
            Three simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Resume",
              desc: "Drag & drop your PDF or DOCX resume file.",
            },
            {
              step: "02",
              title: "AI Analysis",
              desc: "Our AI scans formatting, keywords, and structure.",
            },
            {
              step: "03",
              title: "Get Results",
              desc: "View your score, strengths, and improvement tips.",
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
                <span className="text-2xl font-bold gradient-text font-[Poppins]">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-[Poppins]">
                {s.title}
              </h3>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Analysis Result (rendered after analysis) ─── */}
      {result && (
        <div ref={resultRef}>
          <AnalysisResult result={result} />
        </div>
      )}

      {/* ─── Social Proof / Stats ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="glass-card p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Resumes Analyzed" },
              { value: "95%", label: "User Satisfaction" },
              { value: "40+", label: "Industries Covered" },
              { value: "2s", label: "Avg. Analysis Time" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold gradient-text font-[Poppins]">
                  {s.value}
                </p>
                <p className="text-slate-400 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-[Poppins]">
              Ready to improve your resume?
            </h2>
            <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals using AI to land their dream jobs.
            </p>
            <Link
              to="/signup"
              className="saas-btn saas-btn-primary text-base py-4 px-10 rounded-xl"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-indigo-500" />
            <span className="text-slate-400 text-sm">AI Resume Analyzer</span>
          </div>
          <p className="text-slate-300 text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
