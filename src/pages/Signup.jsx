import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Brain, ArrowRight } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function Signup() {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (role !== "company") {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          role,
          createdAt: serverTimestamp(),
        });
      }

      if (role === "company") {
        await setDoc(doc(db, "companies", userCredential.user.uid), {
          userId: userCredential.user.uid,
          name,
          email,
          role: "company",
          createdAt: serverTimestamp(),
        });
      }

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use")
        setError("This email is already registered. Try logging in instead.");
      else if (err.code === "auth/weak-password")
        setError("Password is too weak. Use a stronger password.");
      else if (err.message?.includes("insufficient permissions"))
        setError(
          "Signup succeeded but saving profile failed: check Firestore rules.",
        );
      else setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <Brain size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-[Poppins]">
            Create your account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Get started with AI Resume Analyzer
          </p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm text-slate-900 placeholder-slate-300"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm text-slate-900 placeholder-slate-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm text-slate-900 placeholder-slate-300"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-600 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "user",
                    label: "Job Seeker",
                    desc: "Looking for work",
                  },
                  {
                    value: "company",
                    label: "Employer",
                    desc: "Hiring talent",
                  },
                ].map((r) => (
                  <label
                    key={r.value}
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      role === r.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="hidden"
                    />
                    <span
                      className={`text-sm font-medium ${role === r.value ? "text-indigo-600" : "text-slate-600"}`}
                    >
                      {r.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                      {r.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="saas-btn saas-btn-primary w-full py-3 rounded-xl text-sm"
            >
              <span className="flex items-center gap-2">
                Create account <ArrowRight size={16} />
              </span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
