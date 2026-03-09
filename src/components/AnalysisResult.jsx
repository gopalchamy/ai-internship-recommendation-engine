import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function AnalysisResult({ result }) {
  const { score, strengths, weaknesses, suggestions, atsScore, skillGaps } =
    result;

  // Circular progress ring
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const atsOffset = circumference - (atsScore / 100) * circumference;

  const scoreColor =
    score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const atsColor =
    atsScore >= 80 ? "#22c55e" : atsScore >= 60 ? "#eab308" : "#ef4444";

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
      <div className="text-center mb-12">
        <p className="text-indigo-500 text-sm font-semibold uppercase tracking-wider mb-3">
          Analysis Complete
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Poppins]">
          Your Resume <span className="gradient-text">Results</span>
        </h2>
      </div>

      {/* ── Score Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Score */}
        <div className="glass-card p-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 font-[Poppins]">
            Overall Score
          </h3>
          <div className="relative">
            <svg width="180" height="180" className="circular-score">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
                style={{
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-extrabold font-[Poppins]"
                style={{ color: scoreColor }}
              >
                {score}
              </span>
              <span className="text-slate-400 text-sm">out of 100</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-4 text-center max-w-xs">
            {score >= 80
              ? "Excellent! Your resume is well-optimized."
              : score >= 60
                ? "Good, but there's room for improvement."
                : "Needs work. Follow the suggestions below."}
          </p>
        </div>

        {/* ATS Score */}
        <div className="glass-card p-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 font-[Poppins]">
            ATS Compatibility
          </h3>
          <div className="relative">
            <svg width="180" height="180" className="circular-score">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={atsColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={atsOffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-extrabold font-[Poppins]"
                style={{ color: atsColor }}
              >
                {atsScore}
              </span>
              <span className="text-slate-400 text-sm">ATS Score</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-4 text-center max-w-xs">
            {atsScore >= 80
              ? "Great ATS compatibility — most systems will parse this well."
              : "Consider restructuring to improve ATS readability."}
          </p>
        </div>
      </div>

      {/* ── Strengths ── */}
      <div className="glass-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">
            Strengths
          </h3>
        </div>
        <ul className="space-y-3">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2
                size={16}
                className="text-emerald-500 mt-1 shrink-0"
              />
              <span className="text-slate-600">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Weaknesses ── */}
      <div className="glass-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <XCircle size={20} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">
            Areas for Improvement
          </h3>
        </div>
        <ul className="space-y-3">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-3">
              <AlertTriangle
                size={16}
                className="text-amber-500 mt-1 shrink-0"
              />
              <span className="text-slate-600">{w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Suggestions ── */}
      <div className="glass-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Lightbulb size={20} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">
            Suggestions
          </h3>
        </div>
        <ul className="space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <TrendingUp size={16} className="text-indigo-500 mt-1 shrink-0" />
              <span className="text-slate-600">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Skill Gaps ── */}
      {skillGaps && skillGaps.length > 0 && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center">
              <ShieldCheck size={20} className="text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">
              Skill Gaps Detected
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {skillGaps.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
